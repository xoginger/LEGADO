import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
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

export const metadata: Metadata = {
  title: "LEGADO Entrenamiento — capturar y enseñar",
  description:
    "Plataforma de entrenamiento de LEGADO: captura memorias y prueba el chat local-first.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
