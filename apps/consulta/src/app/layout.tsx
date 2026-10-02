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
  title: "LEGADO Consulta — hablar con el legado",
  description:
    "Interfaz de consulta de LEGADO para hijos y familia: conversar con el legado, sin editar memorias.",
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
