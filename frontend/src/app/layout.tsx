import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Land Intelligence Platform",
  description: "AI-Powered Land Valuation & Risk Analytics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
