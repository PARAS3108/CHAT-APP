import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image }); // wait for the profile update to complete
    };
  };
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <div className="max-w-2xl mx-auto p-3 sm:p-4 py-6 sm:py-8">
        <div className="bg-base-300 rounded-xl p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-sm sm:text-base">
              Your profile information
            </p>
          </div>
          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-1.5 sm:p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 text-center px-4">
              {isUpdatingProfile
                ? "Updating..."
                : "Click the icon to change your profile picture"}
            </p>
          </div>
          {/* user info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Full Name
              </div>
              <p className="px-3 sm:px-4 py-2 sm:py-2.5 bg-base-200 rounded-lg border text-sm sm:text-base">
                {authUser?.fullName}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Email
              </div>
              <p className="px-3 sm:px-4 py-2 sm:py-2.5 bg-base-200 rounded-lg border text-sm sm:text-base break-all">
                {authUser?.email}
              </p>
            </div>
          </div>
          {/*  additional info*/}
          <div className="mt-4 sm:mt-6 bg-base-300 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
              Account Information
            </h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span className="text-right">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
