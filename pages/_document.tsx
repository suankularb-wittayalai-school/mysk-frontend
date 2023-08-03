// External libraries
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


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

        {/* App bar color */}
        <meta
          name="theme-color"
          content="#d8e7ef"
          media="(prefers-color-scheme: light)"
          key="theme-light"
        />
        <meta
          name="theme-color"
          content="#27353d"
          media="(prefers-color-scheme: dark)"
          key="theme-dark"
        />
        <meta name="google" content="notranslate" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </body>
    </Html>
  );
}
