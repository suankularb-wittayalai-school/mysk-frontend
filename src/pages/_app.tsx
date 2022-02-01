// Modules
import type { AppProps } from "next/app";

// Styles
import "../styles/global.css";

const App = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default App;
