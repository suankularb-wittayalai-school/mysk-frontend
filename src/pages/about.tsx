// Modules
import type { NextPage } from "next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { ListLayout, Title } from "@suankularb-components/react";

// Page
const Developers: NextPage = (): JSX.Element => (
  <ListLayout
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
    </ListLayout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "about"])),
  },
});

export default Developers;
