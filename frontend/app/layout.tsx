import "@/app/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/ui/AuthProvider";

/* ───────────── SITE METADATA ───────────── */
export const metadata: Metadata = {
  title: {
    default: "Brightly",
    template: "%s • Brightly",
  },
  description: "A private space to collect good moments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
