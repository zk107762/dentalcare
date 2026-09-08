import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0b7c83",
};

export const metadata: Metadata = {
  title: "Dr. Ahmed Khan | Modern Dental Care",
  description:
    "Modern, comfortable and personalized dental care. Book your appointment today for a healthier, brighter smile.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SmileCare",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${manrope.variable} h-full`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
