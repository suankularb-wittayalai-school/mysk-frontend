// Imports
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b50077" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          key="theme-color-light"
          name="theme-color"
          content="#e7f0f6" // surface-2
          media="(prefers-color-scheme: light)"
        />
        <meta
          key="theme-color-dark"
          name="theme-color"
          content="#004c6d" // primary-container
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <script src="https://accounts.google.com/gsi/client" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
