import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SvgSymbols } from "@/components/SvgSymbols";
import { ScriptsController } from "@/components/ScriptsController";
import { StickyAiSearchDock } from "@/components/StickyAiSearchDock";

export const metadata: Metadata = {
  title: "Fulminous Software | Digital Transformation Company",
  description:
    "Fulminous Software delivers the best-quality, advanced software solutions that fit all your business ideas and drive maximum growth.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lato:wght@400;700&family=Figtree:wght@400;500;600;800;900&family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SvgSymbols />
        <ScriptsController />
        {children}
        <StickyAiSearchDock />
      </body>
    </html>
  );
}
