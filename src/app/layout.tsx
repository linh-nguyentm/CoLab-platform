import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { AppStateProvider } from "@/lib/app-state";
import { NavBar } from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoLab — Project Study Collaboration Hub",
  description:
    "One shared record for university-industry project studies, from topic matching to handover.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <RoleProvider>
          <AppStateProvider>
            <NavBar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 bg-white py-6">
              <div className="mx-auto max-w-6xl px-6 text-xs text-slate-400">
                CoLab — a Phase 2 prototype for the BirdVision Project Study (TUM School of Management).
              </div>
            </footer>
          </AppStateProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
