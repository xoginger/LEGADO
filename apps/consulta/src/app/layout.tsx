import type { Metadata } from "next";
import {
  DM_Sans,
  Exo_2,
  Fraunces,
  Libre_Baskerville,
  Nunito,
  Orbitron,
  Share_Tech_Mono,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-legado-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-legado-sans",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-theme-mono",
  weight: "400",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-theme-hud",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-theme-tech",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-theme-round",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-theme-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-theme-serif-body",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-theme-minimal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LEGADO Consulta — hablar con el legado",
  description:
    "Interfaz de consulta de LEGADO para hijos y familia: conversar con el legado, sin editar memorias.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="legado"
      className={`${fraunces.variable} ${sourceSans.variable} ${shareTechMono.variable} ${orbitron.variable} ${exo2.variable} ${nunito.variable} ${libreBaskerville.variable} ${sourceSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
