import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHEN Knowledge Hub | Safety, Health and Environment Network",
  description:
    "The official publication and knowledge-sharing platform of the Safety, Health and Environment Network (SHEN). Access articles, research, news, and resources.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-shen-gray-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
