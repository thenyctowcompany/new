import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply to Drive for The NYC Towing Service",
  description: "Apply for a tow driver or dispatcher role. W-2 employment, full benefits for full-time, competitive pay, CDL and tow experience welcome but not required — we train.",
  alternates: { canonical: "/apply-for-towing-job" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
