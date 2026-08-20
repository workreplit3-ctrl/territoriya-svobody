import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Территория Свободы — Студия ландшафтного дизайна",
  description:
    "Создаём уникальные ландшафтные проекты для частных садов и общественных пространств. Природный дизайн, в котором каждая деталь имеет значение.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Территория Свободы — Студия ландшафтного дизайна",
    description: "Природный дизайн, в котором каждая деталь имеет значение",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* SVG filters for nature effects */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <filter id="wind-displacement">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.04"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
