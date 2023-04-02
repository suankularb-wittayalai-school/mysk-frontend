/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env?.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ["ykqqepbodqjhiwfjcvxe.supabase.co"],
  },
  i18n,
  async redirects() {
    return [
      { source: "/account/login", destination: "/", permanent: true },
      { source: "/welcome", destination: "/account/welcome", permanent: true },
      { source: "/learn/:id", destination: "/learn", permanent: true },
      { source: "/admin", destination: "/lookup", permanent: true },
    ];
  },
});
