import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

function UserFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Links & Branding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8 text-center md:text-left">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tour Master</h2>
            <p className="text-sm">
              Your journey begins here. Discover, plan, and book unforgettable trips with us in 2025 and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/packages" className="hover:text-white">Packages</a></li>
              <li><a href="/enquiry" className="hover:text-white">Enquiry</a></li>
              <li><a href="/login" className="hover:text-white">Login</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Connect with Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              <a href="mailto:support@tourmaster.com" className="hover:text-white"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 text-sm text-center">
          <p>&copy; 2025 Tour Master. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
