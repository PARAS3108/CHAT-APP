import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h1 className="text-base sm:text-lg font-bold">Chatty</h1>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to={"/settings"}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline text-sm sm:text-base">
                    Profile
                  </span>
                </Link>

                <button
                  className="flex gap-1 sm:gap-2 items-center p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline text-sm sm:text-base">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
