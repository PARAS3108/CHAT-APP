import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// Removed unused imports (Subscript, Users, use) to clean up bundle
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  // unreadCounts holds number of unread messages per userId
  unreadCounts: {},
  isUsersLoading: false,
  isMessagesLoading: false,
  // we keep a reference to the active socket message listener to remove it later
  _messageListener: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      // reset unread count for this user when messages are fetched/opened
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [userId]: 0 },
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  //todo :optimize for later
  setSelectedUser: (selectedUser) =>
    set((state) => ({
      selectedUser,
      // clear unread for opened conversation
      unreadCounts: { ...state.unreadCounts, [selectedUser?._id]: 0 },
    })),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
  // increment unread count for a user
  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
  // reset unread count for a user
  resetUnread: (userId) =>
    set((state) => ({ unreadCounts: { ...state.unreadCounts, [userId]: 0 } })),
  // Ensure a single persistent listener is attached to socket for incoming messages.
  // This listener runs regardless of whether a conversation is open so unread counts
  // increment as soon as messages arrive.
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return; // socket not connected yet
    const { _messageListener } = get();
    // If listener already attached, nothing to do
    if (_messageListener) return;

    const listener = (newMessage) => {
      const authUser = useAuthStore.getState().authUser;
      const selectedUser = get().selectedUser;

      // If the message belongs to the currently open conversation, append it
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        set({ messages: [...get().messages, newMessage] });
        // Also ensure unread count for this user is reset (opened conversation)
        if (newMessage.senderId !== authUser?._id) {
          get().resetUnread(newMessage.senderId);
        }
      } else {
        // If it's an incoming message from another user (not sent by us), increment unread
        if (authUser && newMessage.senderId !== authUser._id) {
          get().incrementUnread(newMessage.senderId);
        }
      }
    };

    socket.on("newMessage", listener);
    set({ _messageListener: listener });
  },
  clearMessages: () => {
    const { _messageListener } = get();
    const socket = useAuthStore.getState().socket;
    if (_messageListener && socket) {
      socket.off("newMessage", _messageListener);
      set({ _messageListener: null });
    }
  },
}));
