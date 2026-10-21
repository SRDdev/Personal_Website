import type { Metadata } from "next";
import "./globals.css";
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
