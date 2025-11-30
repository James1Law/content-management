import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Blog | Synthwave",
  description: "A retro-futuristic personal blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-void text-synth-text font-space min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
