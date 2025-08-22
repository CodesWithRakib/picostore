"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Package,
  LogOut,
  Settings,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 shadow-lg py-3 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-xl py-2" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-700 p-2 rounded-lg group-hover:bg-blue-600 transition-all duration-300">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
              PicoStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-blue-100 hover:text-white transition-all duration-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/products"
              className="text-blue-100 hover:text-white transition-all duration-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Products</span>
            </Link>

            {status === "loading" ? (
              <div className="h-9 w-20 bg-blue-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full bg-blue-700 hover:bg-blue-600 border-0"
                  >
                    <Avatar className="h-8 w-8 border-2 border-blue-400">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {session.user?.name?.charAt(0) || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800"
                  >
                    <Link
                      href="/dashboard/add-product"
                      className="flex items-center gap-2 w-full"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-medium px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </Button>
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-blue-100 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2 bg-blue-800 rounded-lg p-4">
              <Link
                href="/"
                className="text-blue-100 hover:text-white transition-all duration-200 flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/products"
                className="text-blue-100 hover:text-white transition-all duration-200 flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Products</span>
              </Link>

              {status === "loading" ? (
                <div className="h-12 bg-blue-700 rounded-lg animate-pulse"></div>
              ) : session ? (
                <>
                  <div className="flex items-center space-x-3 py-3 px-4 bg-blue-700 rounded-lg">
                    <Avatar className="h-10 w-10 border-2 border-blue-400">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {session.user?.name?.charAt(0) || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-blue-200">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/add-product"
                    className="text-blue-100 hover:text-white transition-all duration-200 flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-center text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800 mt-2 font-medium py-3 rounded-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2"
                >
                  <Button
                    variant="default"
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 border-0 font-medium py-3 rounded-full"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
