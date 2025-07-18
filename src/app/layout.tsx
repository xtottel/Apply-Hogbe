import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Mama Hogbe 2025 Portal | Powered by Sendexa",
    template: "%s | Mama Hogbe 2025",
  },
  description:
    "Register for the Mama Hogbe 2025 beauty and talent contest. Buy your registration PIN and submit your form online. Powered by Sendexa.",
  metadataBase: new URL("https://mamahogbe.sendexa.co"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mama Hogbe 2025 Registration Portal",
    description:
      "Official portal for Mama Hogbe 2025. Register online, buy PINs, and compete. Fast, secure and powered by Sendexa.",
    url: "https://mamahogbe.sendexa.co",
    siteName: "Mama Hogbe 2025",
    images: [
      {
        url: "/Banner.jpg", // 🔁 Replace with your actual OG image in /public/og
        width: 1200,
        height: 630,
        alt: "Mama Hogbe 2025 Registration Portal",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="sendexa-theme"
        >
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
