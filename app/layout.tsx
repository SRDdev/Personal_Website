import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import GoatCounterTracker from "./components/GoatCounterTracker";
import { ThemeProvider } from "./providers";

export const metadata: Metadata = {
  title: "Shreyas Dixit",
  description: "All about me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased transition-colors duration-300"
      >
        <Script
          data-goatcounter="https://shreyas.goatcounter.com/count"
          data-goatcounter-settings='{"no_onload": true}'
          async
          src="//gc.zgo.at/count.js"
        />
        <GoatCounterTracker />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
