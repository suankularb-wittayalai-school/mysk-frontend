/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env?.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching: require("./cache"),
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
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace(
            "https://",
            "",
          ),
        },
        { protocol: "https", hostname: "lh3.googleusercontent.com" },
      ],
    },
    i18n,
    async redirects() {
      return [
        { source: "/index.php", destination: "/", permanent: true },
        { source: "/login.php", destination: "/", permanent: true },
        {
          source: "/index_online_std.php",
          destination: "/learn",
          permanent: true,
        },
        {
          source: "/index_online_std_time_table.php",
          destination: "/learn",
          permanent: true,
        },
        { source: "/account/login", destination: "/", permanent: true },
        {
          source: "/welcome",
          destination: "/account",
          permanent: true,
        },
        {
          source: "/account/welcome",
          destination: "/account",
          permanent: true,
        },
        { source: "/learn/:id", destination: "/learn", permanent: true },
        {
          source: "/classes/print/:number",
          destination: "/classes/:number/print",
          permanent: true,
        },
        {
          source: "/lookup/:path*",
          destination: "/search/:path*",
          permanent: true,
        },
        { source: "/news/info/:id", destination: "/news/:id", permanent: true },
      ];
    },
  }),
);
