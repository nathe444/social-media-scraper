import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Social Media Explorer",
  description: "Analyze and explore content across social media platforms",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#0F172A]">
        <nav className="border-b border-gray-700/50 backdrop-blur-sm bg-[#0F172A]/80 text-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto md:px-4">
            <div className="flex items-center h-16 justify-between">
              <a 
                href="/" 
                className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Social Media Explorer
              </a>
              <div className="flex gap-6">
                <a 
                  href="/reddit" 
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  Reddit Explorer
                </a>
                <a 
                  href="/facebook" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  Facebook Explorer
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}