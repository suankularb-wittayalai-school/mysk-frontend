// Modules
import Document, { Html, Head, Main, NextScript } from "next/document";

class MySKDocument extends Document {
  render() {
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
          />
          <meta
            name="theme-color"
            content="#243037"
            media="(prefers-color-scheme: dark)"
          />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Noto+Sans+Thai:wght@300;400;500;700&family=Sarabun:wght@300;400;500;700&family=Sora:wght@300;400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MySKDocument;
