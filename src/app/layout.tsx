import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: '--font-jetbrainsMono'
});

export const metadata: Metadata = {
  title: "CSRF POC Generator | Alejandro Sol",
  description: "Param to HTML CSRF POC Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable}`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
