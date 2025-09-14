import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full lg:w-80 xl:w-96 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-3 sm:p-5">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-medium text-sm sm:text-base lg:block">
            Contacts
          </span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-2 sm:py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0 flex-shrink-0">
              <div className="skeleton w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
            </div>

            {/* User info skeleton - visible on mobile center, left on desktop */}
            <div className="block text-center lg:text-left min-w-0 flex-1">
              <div className="skeleton h-3 sm:h-4 w-20 sm:w-32 mb-1 sm:mb-2 mx-auto lg:mx-0" />
              <div className="skeleton h-2 sm:h-3 w-12 sm:w-16 mx-auto lg:mx-0" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
