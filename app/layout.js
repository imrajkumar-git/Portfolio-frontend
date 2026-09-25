import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CosmicBackground from "@/components/CosmicBackground";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Rajkumar Aryal — Full Stack Developer",
  description:
    "Portfolio of Rajkumar Aryal — full stack developer, designer, and IT professional based in Abu Dhabi, UAE.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <ThemeProvider>
          <AuthProvider>
            <CosmicBackground />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
