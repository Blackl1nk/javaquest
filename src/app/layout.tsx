import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JavaQuest — учи Java как квест",
  description:
    "Интерактивный курс Java: короткие миссии, живой редактор кода, XP, стрики и достижения. Учи Java каждый день — без скучных учебников.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: антивирусные расширения (Bitdefender и т.п.)
    // добавляют в DOM свои атрибуты (bis_skin_checked, __processed_*) до гидратации —
    // это шум не из нашего кода, отключаем предупреждения на корневых элементах.
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}