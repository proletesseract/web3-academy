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
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
