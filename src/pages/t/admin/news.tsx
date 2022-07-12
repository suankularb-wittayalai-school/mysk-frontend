// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Supabase
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

// Page
const AdminNews: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["admin", "news", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("news.title.full"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("news.title.title"),
              subtitle: t("news.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="newspaper" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <p>TODO</p>
        </Section>
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "admin", "news"])),
  },
});

export default AdminNews;
