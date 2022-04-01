// Modules
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { RegularLayout, Title } from "@suankularb-components/react";

// Page
const Developers: NextPage = (): JSX.Element => (
  <RegularLayout
    Title={
      <Title
        name={{ title: "" }}
        pageIcon="home"
        backGoesTo="/account/login"
        LinkElement={Link}
        className="sm:none"
        key="title"
      />
    }
  >
    <p>TODO</p>
  </RegularLayout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "about"])),
  },
});

export default Developers;
