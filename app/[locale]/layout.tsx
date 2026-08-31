import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { DynamicBackground } from "@/components/background";
import { IntlayerProvider } from "@/providers/intlayer-provider";
import { QueryProvider } from "@/providers/query-provider";
import { isLocale, locales } from "@/lib/i18n";

import "../globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin", "cyrillic"],
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();

	return {
		title: locale === "fr" ? "Flottes" : "Fleets",
	};
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();

	return (
		<html
			lang={locale}
			className={`${inter.variable} h-full antialiased`}
			data-glassmorphism="dark"
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col" suppressHydrationWarning>
				<DynamicBackground />
				<div id="app-root" className="flex min-h-full flex-1 flex-col">
					<IntlayerProvider locale={locale}>
						<QueryProvider>{children}</QueryProvider>
					</IntlayerProvider>
				</div>
			</body>
		</html>
	);
}
