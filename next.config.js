const { i18n } = require("./next-i18next.config");
const { withPlausibleProxy } = require("next-plausible");
const nextTranslate = require("next-translate-plugin");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching: require("./cache"),
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", ""),
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
      { source: "/welcome", destination: "/account", permanent: true },
      { source: "/account/welcome", destination: "/account", permanent: true },
      {
        source: "/manage/attendance/date/:date",
        destination: "/manage/attendace/:date",
        permanent: true,
      },
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
};

module.exports = withPWA(withPlausibleProxy()(nextTranslate(config)));
