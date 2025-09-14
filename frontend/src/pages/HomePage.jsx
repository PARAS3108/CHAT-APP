import React from "react";
import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/SideBar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 sm:pt-20 px-2 sm:px-4">
        <div className="bg-base-100 rounded-none sm:rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-none sm:rounded-lg overflow-hidden">
            {/* Mobile: Show sidebar or chat based on selection */}
            <div className="block lg:hidden w-full h-full">
              {!selectedUser ? <Sidebar /> : <ChatContainer />}
            </div>

            {/* Desktop: Show both sidebar and chat */}
            <div className="hidden lg:flex w-full h-full">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
