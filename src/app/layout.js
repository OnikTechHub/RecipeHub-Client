import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast"; // 👈 ১. টোস্টার ইম্পোর্ট করো

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecipeHub - Culinary Secrets",
  description: "Explore secret culinary methods",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {/* 👈 ২. Toaster কম্পোনেন্টটি এখানে বসিয়ে দাও যাতে যেকোনো পেজ থেকে টোস্ট ট্রিগার করা যায় */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--fallback-b1,hsl(var(--b1)))',
              color: 'var(--fallback-bc,hsl(var(--bc)))',
              borderRadius: '12px',
              border: '1px solid rgba(var(--fallback-bc,hsl(var(--bc))), 0.1)',
            },
          }}
        />
        <Navbar />
        <main className="min-h-[85vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}