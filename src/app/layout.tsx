import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSys – Smart Campus Management",
  description: "Premium school & college management: attendance, gate pass, fees, results and more.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
