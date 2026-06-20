import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/layout/RootChrome";
import { ReactQueryProvider } from "@/src/providers/ReactQueryProvider";
import { getServerServices } from "@/src/services/server";
import { mapCategoryToUiCategory } from "@/src/utils/uiMappers";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alankritha | Luxury Jewellery Catalogue",
  description: "Premium Kerala jewellery catalogue with WhatsApp enquiry.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navCategories: ReturnType<typeof mapCategoryToUiCategory>[] = [];

  try {
    const { categoryService } = await getServerServices();
    const categories = await categoryService.getCategories({ activeOnly: true });
    navCategories = categories.map(mapCategoryToUiCategory);
  } catch {
    navCategories = [];
  }

  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <RootChrome categories={navCategories}>{children}</RootChrome>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
