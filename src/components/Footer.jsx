import Link from "next/link";
import { FaUtensils, FaFacebookF, FaTwitter, FaInstagram, FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content p-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Brand & Copyright */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FaUtensils className="w-6 h-6" />
            <span>RecipeHub</span>
          </div>
          <p className="text-sm opacity-80">
            Discover, share, and manage the best culinary recipes from around the world.
          </p>
          <p className="text-xs opacity-60 mt-4">
            © {new Date().getFullYear()} RecipeHub. All rights reserved.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h6 className="footer-title text-white opacity-100 mb-4">Quick Links</h6>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="link link-hover">Home</Link>
            <Link href="/browse-recipes" className="link link-hover">Browse Recipes</Link>
            <Link href="/login" className="link link-hover">Login</Link>
            <Link href="/register" className="link link-hover">Register</Link>
          </div>
        </div>

        {/* Section 3: Contact Information */}
        <div>
          <h6 className="footer-title text-white opacity-100 mb-4">Contact Us</h6>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FaLocationDot className="w-4 h-4 text-primary" />
              <span>Chattogram City, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="w-4 h-4 text-primary" />
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4 text-primary" />
              <span>support@recipehub.com</span>
            </div>
          </div>
        </div>

        {/* Section 4: Social Links */}
        <div>
          <h6 className="footer-title text-white opacity-100 mb-4">Follow Us</h6>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-base-100 rounded-full text-neutral hover:bg-primary hover:text-white transition-colors">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-base-100 rounded-full text-neutral hover:bg-primary hover:text-white transition-colors">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-base-100 rounded-full text-neutral hover:bg-primary hover:text-white transition-colors">
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}