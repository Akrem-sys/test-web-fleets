import { type IntlayerConfig, LocalesValues } from "intlayer";

/** fr + en, fr default; `prefix-all` matches the locale-prefixed routing in proxy.ts. */
const config: IntlayerConfig = {
	internationalization: {
		locales: ["fr", "en"] satisfies LocalesValues[],
		defaultLocale: "fr",
	},
	routing: {
		mode: "prefix-all",
	},
};

export default config;
