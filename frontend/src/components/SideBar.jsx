import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { Users } from "lucide-react";

const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { unreadCounts } = useChatStore();

  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getUsers();
  }, []);
  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-full lg:w-80 xl:w-96 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-3 sm:p-5">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-medium text-sm sm:text-base lg:block">
            Contacts
          </span>
        </div>
        {/* todo online filter model */}
      </div>
      <div className="overflow-y-auto w-full py-2 sm:py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-base-300 transition-colors${
              selectedUser?._id === user._id
                ? " bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0 flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            {/* User info - visible on mobile center, left on desktop */}
            <div className="block text-center lg:text-left min-w-0 flex-1">
              <div className="font-medium truncate text-sm sm:text-base">
                {user.fullName}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
            {/* unread badge */}
            {unreadCounts[user._id] > 0 && (
              <div className="ml-2 flex items-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-primary text-white">
                  {unreadCounts[user._id]}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
