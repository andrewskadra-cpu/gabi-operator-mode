import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const title = "Skadra Ventures — G-OPS";
const description =
  "G-OPS is Skadra Ventures' dual-track CEO and COO executive-development system for building owner and operator judgment.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(protocol + "://" + host) : undefined;
  const socialImage = metadataBase
    ? new URL("/og.png", metadataBase).toString()
    : undefined;

  return {
    title,
    description,
    metadataBase,
    openGraph: {
      title,
      description,
      type: "website",
      images: socialImage
        ? [{ url: socialImage, width: 1731, height: 909, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage ? [socialImage] : [],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
