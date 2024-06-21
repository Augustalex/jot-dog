import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

const noto = Noto_Sans({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Notes",
  description: "Jot down notes with your team",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
