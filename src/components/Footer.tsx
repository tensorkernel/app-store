import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github as GitHub, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-blue-600 rounded-xl p-8 mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-100">Subscribe to our newsletter for the latest app releases and updates.</p>
            </div>
            <form className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-l-md w-full sm:w-64 text-gray-800 focus:outline-none mb-2 sm:mb-0"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-r-md transition-colors sm:w-auto w-full"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Download className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">APK Store</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted source for discovering and downloading the best mobile applications.
              We curate high-quality apps to enhance your digital experience.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/games" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Games
                </Link>
              </li>
              <li>
                <Link to="/category/social" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Social
                </Link>
              </li>
              <li>
                <Link to="/category/productivity" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Productivity
                </Link>
              </li>
              <li>
                <Link to="/category/entertainment" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Entertainment
                </Link>
              </li>
              <li>
                <Link to="/category/tools" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  DMCA
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 App Street, Digital City, 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">support@apkstore.com</span>
              </li>
              <li className="mt-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-300">Working Hours</h4>
                <p className="text-gray-400 text-sm">Monday - Friday: 9AM - 6PM</p>
                <p className="text-gray-400 text-sm">Saturday: 10AM - 4PM</p>
                <p className="text-gray-400 text-sm">Sunday: Closed</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; {currentYear} APK Store. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Developers
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                API
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Careers
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
