"use client";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  Search,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  userName: string;
  userEmail: string;
  userImage: string;
}

export default function MainContent({
  children,
  onMenuClick,
  onToggleSidebar,
  sidebarCollapsed,
  userName,
  userEmail,
  userImage,
}: MainContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-hidden transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}
    >
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          {/* Left section */}
          <div className="flex items-center w-full sm:w-auto">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop sidebar toggle button */}
            <button
              className="hidden lg:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2"
              onClick={onToggleSidebar}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-6 w-6" />
              ) : (
                <ChevronLeft className="h-6 w-6" />
              )}
            </button>

            {/* Search bar - hidden on mobile, shown on desktop */}
            <div className="hidden md:flex relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search..." className="pl-10 w-full" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile search button */}
            <Button variant="ghost" size="sm" className="md:hidden p-1 h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-1 h-9 w-9">
                <Bell className="h-5 w-5" />
                <Badge className="absolute top-0 right-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </div>

            {/* Settings button - hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex p-1 h-9 w-9"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* User dropdown */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail}
                </p>
              </div>

              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                {userImage ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={userImage}
                    alt={userName}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </Button>

              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile search bar - shown below header on mobile */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 w-full" />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}
