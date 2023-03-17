// External libraries
import { Html, Head, Main, NextScript } from "next/document";

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
        <meta
          name="theme-color"
          content="#dfebf3"
          media="(prefers-color-scheme: light)"
          key="theme-light"
        />
        <meta
          name="theme-color"
          content="#243037"
          media="(prefers-color-scheme: dark)"
          key="theme-dark"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
