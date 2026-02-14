import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const RobotoSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Novera",
  description: "ecommerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${RobotoSans.variable} antialiased`}>
        <QueryProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
