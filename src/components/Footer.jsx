import Link from "next/link";
import { FaUtensils, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLocationDot, FaPhone, FaEnvelope, FaShieldHalved, FaFileContract } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-100 text-base-content border-t border-base-300/50 pt-12 pb-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Section 1: Brand & Description */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent w-fit">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <FaUtensils className="w-5 h-5" />
            </div>
            <span>RecipeHub</span>
          </Link>
          <p className="text-sm text-base-content/70 max-w-sm leading-relaxed mt-1">
            Discover, cook, and share the best culinary recipes from expert chefs and passionate home cooks around the globe. Elevate your cooking skills with premium guides.
          </p>
          <div className="flex gap-2.5 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 bg-base-200/80 rounded-xl text-base-content/80 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all shadow-xs" title="Facebook">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-base-200/80 rounded-xl text-base-content/80 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all shadow-xs" title="Twitter">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-base-200/80 rounded-xl text-base-content/80 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all shadow-xs" title="Instagram">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 bg-base-200/80 rounded-xl text-base-content/80 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all shadow-xs" title="YouTube">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Section 2: Explore / Quick Links */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider text-xs uppercase">Navigation</h6>
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Home</Link>
            <Link href="/browse-recipes" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Browse Recipes</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Pricing & Membership</Link>
            <Link href="/about" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">About Us</Link>
          </div>
        </div>

        {/* Section 3: Legal & Help */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider text-xs uppercase">Legal & Support</h6>
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            <Link href="/contact" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Contact Support</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200 flex items-center gap-1.5">
              <FaShieldHalved className="w-3.5 h-3.5 text-primary" />
              <span>Privacy Policy</span>
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200 flex items-center gap-1.5">
              <FaFileContract className="w-3.5 h-3.5 text-primary" />
              <span>Terms & Conditions</span>
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Sign In</Link>
            <Link href="/register" className="hover:text-primary transition-colors text-base-content/80 hover:translate-x-1 duration-200">Join Free</Link>
          </div>
        </div>

        {/* Section 4: Contact Info */}
        <div>
          <h6 className="footer-title text-base-content font-bold opacity-100 mb-4 tracking-wider text-xs uppercase">Contact Hub</h6>
          <div className="flex flex-col gap-3 text-sm text-base-content/80 font-medium">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-base-200 rounded-lg text-primary mt-0.5 shrink-0">
                <FaLocationDot className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">Chattogram City, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-base-200 rounded-lg text-primary shrink-0">
                <FaPhone className="w-3.5 h-3.5" />
              </div>
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-base-200 rounded-lg text-primary shrink-0">
                <FaEnvelope className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">support@recipehub.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-base-300/40 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-3">
        <p>© {new Date().getFullYear()} RecipeHub. All rights reserved. Crafted for food lovers.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;