import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecipeHub - Recipe Sharing Platform",
  description: "Explore secret culinary methods",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <CartProvider>
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--fallback-b1,hsl(var(--b1)))',
                color: 'var(--fallback-bc,hsl(var(--bc))), 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(var(--fallback-bc,hsl(var(--bc))), 0.1)',
              },
            }}
          />
          <Navbar />
          <CartSidebar />
          <main className="min-h-[85vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}