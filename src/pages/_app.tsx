// Modules
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { MaterialIcon, PageLayout } from "@suankularb-components/react";

// Styles
import "@styles/global.css";

const App = ({ Component, pageProps }: AppProps) => {
  const path = useRouter().asPath;

  return (
    <PageLayout
      currentPath={path}
      navItems={[
        {
          name: "หน้าหลัก",
          icon: {
            inactive: <MaterialIcon icon="home" type="outlined" />,
            active: <MaterialIcon icon="home" type="filled" />,
          },
          url: "/",
        },
        {
          name: "เข้าสู่ระบบ",
          icon: {
            inactive: <MaterialIcon icon="login" type="outlined" />,
            active: <MaterialIcon icon="login" type="filled" />,
          },
          url: "/account/login",
        },
        {
          name: "ติดต่อ",
          icon: {
            inactive: <MaterialIcon icon="contacts" type="outlined" />,
            active: <MaterialIcon icon="contacts" type="filled" />,
          },
          url: "/developers",
        },
      ]}
      LinkElement={Link}
    >
      <Component {...pageProps} />
    </PageLayout>
  );
};

export default App;
