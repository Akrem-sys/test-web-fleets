import type { NextConfig } from "next";
import { withIntlayer } from "next-intlayer/server";

const nextConfig: NextConfig = {
	// Self-contained production server (`.next/standalone/server.js`) for Docker deploys.
	// Per Next 16 docs: copy `public` and `.next/static` into the standalone folder manually —
	// done in the Dockerfile (node_modules/next/dist/docs/.../output.md).
	output: "standalone",
};

// Intlayer i18n plugin — withIntlayer returns a Promise, hence the async config export.
export default withIntlayer(nextConfig);
