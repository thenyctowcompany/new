import type { Metadata } from "next";
import { Sora, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, organizationSchema } from "@/lib/schema";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

const SITE_URL = "https://www.thenyctowingservice.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The NYC Towing Service | 24/7 Towing & Roadside in All 5 Boroughs",
    template: "%s | The NYC Towing Service",
  },
  description:
    "24/7 towing and roadside assistance across all five NYC boroughs. Light-duty, heavy-duty, flatbed, battery, tire, lockout, gas, and winch-out. Flat-rate pricing, 20–40 minute arrival, licensed and insured. Call (212) 470-4068.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "The NYC Towing Service",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <JsonLd schema={organizationSchema()} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
