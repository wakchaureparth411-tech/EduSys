import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: "EduSys - Smart Campus School & College Management System",
  description: "Complete premium glassmorphic educational resource planner, gate exit permits and directory platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="h-full font-sans bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f1f5f9] overflow-x-hidden">
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
