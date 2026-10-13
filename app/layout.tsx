import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const podkova = localFont({
  src: [
    { path: "../public/fonts/podkova-regular.ttf", weight: "400" },
    { path: "../public/fonts/podkova-semibold.ttf", weight: "600" },
    { path: "../public/fonts/podkova-bold.ttf", weight: "700" },
  ],
  variable: "--font-heading",
  display: "swap",
});
const schibsted = localFont({
  src: [
    { path: "../public/fonts/schibsted-grotesk-regular.ttf", weight: "400" },
    { path: "../public/fonts/schibsted-grotesk-semibold.ttf", weight: "600" },
    { path: "../public/fonts/schibsted-grotesk-bold.ttf", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://botstopper.net"),
  title: "BotStopper from Techaro | A smarter front door for the web",
  description:
    "BotStopper from Techaro helps protect websites from scraping and automated abuse while keeping the experience straightforward for people.",
  openGraph: {
    siteName: "BotStopper from Techaro",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${podkova.variable} ${schibsted.variable}`}>
      <body>{children}</body>
    </html>
  );
}
