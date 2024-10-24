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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex gap-4">
            <a href="/" className="hover:text-gray-300">Home</a>
            <a href="/reddit" className="hover:text-gray-300">Reddit Scraper</a>
            <a href="/facebook" className="hover:text-gray-300">Facebook Scraper</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
