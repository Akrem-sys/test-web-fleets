import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "./src/lib/i18n";

// The fleets page is currently the app's only page — the explicit default destination.
const defaultPage = "/fleets";

// Bare locale roots (`/fr`, `/en`, `/fr/`, `/en/`) have no page of their own.
const bareLocalePattern = new RegExp(`^/(${locales.join("|")})/?$`);

// Next 16 renamed `middleware` to `proxy` — the exported function must use that name.
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// `/fr`, `/en`, `/fr/`, `/en/` → `<locale>/fleets` (query string preserved).
	const bareLocale = pathname.match(bareLocalePattern);
	if (bareLocale) {
		request.nextUrl.pathname = `/${bareLocale[1]}${defaultPage}`;
		return NextResponse.redirect(request.nextUrl);
	}

	const pathnameHasLocale = locales.some(
		(locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
	);
	if (pathnameHasLocale) return;

	// `/` → default locale + fleets page; anything else keeps the old behavior
	// of prepending the default locale prefix (`/xyz` → `/fr/xyz`).
	request.nextUrl.pathname =
		pathname === "/"
			? `/${defaultLocale}${defaultPage}`
			: `/${defaultLocale}${pathname}`;

	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	// Skip Next internals (_next), API routes, favicon and files with extensions.
	matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
