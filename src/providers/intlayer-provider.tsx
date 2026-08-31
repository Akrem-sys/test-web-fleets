"use client";

import { IntlayerClientProvider } from "next-intlayer";
import type { FC, ReactNode } from "react";

export const IntlayerProvider: FC<{ locale: string; children: ReactNode }> = ({
	locale,
	children,
}) => <IntlayerClientProvider locale={locale}>{children}</IntlayerClientProvider>;
