/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env?.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  // (@SiravitPhokeed)
  // The docs says that `cacheOnFrontEndNav` should be enabled if the user has
  // spotty internet connection. Since we plan to deploy this for a school
  // with...imperfect wi-fi, it’s enabled.
  cacheOnFrontEndNav: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: { domains: ["ykqqepbodqjhiwfjcvxe.supabase.co"] },
    i18n,
    async redirects() {
      return [
        { source: "/account/login", destination: "/", permanent: true },
        {
          source: "/welcome",
          destination: "/account/welcome",
          permanent: true,
        },
        { source: "/learn/:id", destination: "/learn", permanent: true },
        { source: "/admin", destination: "/lookup", permanent: true },
      ];
    },
  })
);
