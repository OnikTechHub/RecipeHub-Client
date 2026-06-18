import Link from "next/link";
import { FaUtensils, FaFacebookF, FaTwitter, FaInstagram, FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-100 text-base-content border-t border-base-300/50 p-10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Brand & Copyright */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <FaUtensils className="w-5 h-5" />
            </div>
            <span>RecipeHub</span>
          </div>
          <p className="text-sm text-base-content/70">
            Discover, share, and manage the best culinary recipes from around the world.
          </p>
          <p className="text-xs text-base-content/50 mt-4">
            © {new Date().getFullYear()} RecipeHub. All rights reserved.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider">Quick Links</h6>
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/browse-recipes" className="hover:text-primary transition-colors">Browse Recipes</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>
        </div>

        {/* Section 3: Contact Information */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider">Contact Us</h6>
          <div className="flex flex-col gap-3 text-sm text-base-content/80 font-medium">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-base-200 rounded-lg text-primary">
                <FaLocationDot className="w-3.5 h-3.5" />
              </div>
              <span>Chattogram City, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-base-200 rounded-lg text-primary">
                <FaPhone className="w-3.5 h-3.5" />
              </div>
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-base-200 rounded-lg text-primary">
                <FaEnvelope className="w-3.5 h-3.5" />
              </div>
              <span>support@recipehub.com</span>
            </div>
          </div>
        </div>

        {/* Section 4: Social Links */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider">Follow Us</h6>
          <div className="flex gap-3">
            <a href="#" className="p-3 bg-base-200 rounded-xl text-base-content hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-sm">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="#" className="p-3 bg-base-200 rounded-xl text-base-content hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-sm">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-3 bg-base-200 rounded-xl text-base-content hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-sm">
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;