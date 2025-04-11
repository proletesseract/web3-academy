import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Navigation/Footer";
import PageBackground from "../components/Background/PageBackground";

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
      <body>
        <PageBackground />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
