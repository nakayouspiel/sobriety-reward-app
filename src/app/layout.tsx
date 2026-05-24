import type { Metadata, Viewport } from "next";
import "./globals.css";
import FooterNav from "@/components/FooterNav";
import SwipeContainer from "@/components/SwipeContainer";

export const metadata: Metadata = {
  title: "Sobriety Reward",
  description: "楽しく節酒を続けるための報酬系アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sobriety",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main className="container">
          <SwipeContainer>
            {children}
          </SwipeContainer>
        </main>
        <FooterNav />
      </body>
    </html>
  );
}
