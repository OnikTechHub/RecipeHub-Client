import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import AIChatbot from "@/components/AIChatbot";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecipeHub - Recipe Sharing Platform",
  description: "Explore secret culinary methods",
  icons: {
    icon: "/vercel.jpeg",
    shortcut: "/vercel.jpeg",
    apple: "/vercel.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            toastOptions={{
              duration: 3500,
              style: {
                background: "#0f172a",
                color: "#ffffff",
                borderRadius: "16px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: "600",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
              },
              success: {
                duration: 3500,
                style: {
                  background: "#064e3b",
                  color: "#ffffff",
                  borderRadius: "16px",
                  padding: "12px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "1px solid #10b981",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                },
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#7f1d1d",
                  color: "#ffffff",
                  borderRadius: "16px",
                  padding: "12px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "1px solid #ef4444",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />

          <Navbar />
          <CartSidebar />
          <main className="min-h-[85vh]">{children}</main>
          <AIChatbot />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}