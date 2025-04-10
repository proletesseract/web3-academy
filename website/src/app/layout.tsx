import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navigation/Navbar";

export const metadata: Metadata = {
  title: "Immutable Academy",
  description: "Learn to build on Immutable X with interactive tutorials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-fixed">
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black/70 to-black/80">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
