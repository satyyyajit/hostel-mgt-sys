import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
    });



export const metadata = {
  title: "The Hostel Management System",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={` ${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
