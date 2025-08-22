import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Package,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PicoStore</span>
            </div>
            <p className="text-blue-200 max-w-md">
              Your premier destination for quality products. Discover, shop, and
              experience excellence with every purchase.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="h-1 w-1 bg-blue-400 rounded-full"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-blue-200">
                  123 Commerce Street, Suite 100, Business City
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">support@picostore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 text-sm">
            &copy; {currentYear} PicoStore. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
