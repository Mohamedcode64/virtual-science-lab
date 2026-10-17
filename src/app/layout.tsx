import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/logos/logo2.jpeg",
    shortcut: "/logos/logo2.jpeg",
    apple: "/logos/logo2.jpeg",
  },
  title: {
    default: "معمل العلوم الافتراضي - جامعة الوادي الجديد",
    template: "%s | معمل العلوم الافتراضي",
  },
  description: "معمل إفتراضي لمادة العلوم للصف الرابع والخامس والسادس الإبتدائي - تسع تجارب ثلاثية الأبعاد للتعلم بالملاحظة والتفاعل",
  keywords: [
    "معمل علوم",
    "تجارب علمية",
    "تعليم تفاعلي",
    "الصف الرابع",
    "الصف الخامس",
    "الصف السادس",
    "جامعة الوادي الجديد",
    "كلية التربية",
  ],
  authors: [{ name: "محمد أحمد سيف" }],
  creator: "Mohamed Ahmed Seif",
  publisher: "جامعة الوادي الجديد - كلية التربية",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "معمل العلوم الافتراضي",
    title: "معمل العلوم الافتراضي - جامعة الوادي الجديد",
    description: "اكتشف العلوم بالتجربة والتفاعل - معمل إفتراضي للصفوف الرابع والخامس والسادس الإبتدائي",
  },
  twitter: {
    card: "summary",
    title: "معمل العلوم الافتراضي",
    description: "اكتشف العلوم بالتجربة والتفاعل",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="antialiased"
    >
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
