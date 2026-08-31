import type { NextConfig } from "next";
import { withIntlayer } from "next-intlayer/server";

const nextConfig: NextConfig = {};

// Intlayer i18n plugin — withIntlayer returns a Promise, hence the async config export.
export default withIntlayer(nextConfig);
