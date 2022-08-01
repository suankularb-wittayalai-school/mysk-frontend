// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useQuery } from "react-query";

// SK Components
import {
  Card,
  CardHeader,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import NewsIcon from "@components/icons/NewsIcon";
import NewsFeed from "@components/news/NewsFeed";

// Backend
import { getNewsFeed } from "@utils/backend/news";

// Hooks
import { useProtectPageFor } from "@utils/hooks/protect";

// Supabase
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemType, NewsList } from "@utils/types/news";

// Components
const AddSection = (): JSX.Element => {
  const { t } = useTranslation(["admin", "news"]);
  const newsTypes: NewsItemType[] = ["info", "stats", "form", "payment"];

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="add_circle" allowCustomSize />}
        text={t("news.add.title")}
      />
      <div className="layout-grid-cols-3">
        {newsTypes.map((newsType) => (
          <Link key={newsType} href={`/t/admin/news/create/${newsType}`}>
            <a>
              <Card type="horizontal" appearance="outlined" hasAction>
                <CardHeader
                  icon={<NewsIcon type={newsType} />}
                  title={<h3>{t(`itemType.${newsType}`, { ns: "news" })}</h3>}
                  label={t(`news.add.typeDesc.${newsType}`)}
                  end={<MaterialIcon icon="arrow_forward" />}
                />
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </Section>
  );
};

const EditSection = (): JSX.Element => {
  const { t } = useTranslation("admin");
  const { data } = useQuery("admin-feed", () => getNewsFeed("admin"));

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="edit_note" allowCustomSize />}
        text={t("news.edit.title")}
      />
      <p>{t("news.edit.instructions")}</p>
      <p>
        <strong className="text-tertiary">{t("news.edit.cacheWarning")}</strong>
      </p>
      <NewsFeed
        news={data?.data || []}
        isForAdmin
        btnType="tonal"
      />
    </Section>
  );
};

// Page
const AdminNews: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["admin", "news", "common"]);
  useProtectPageFor("admin");

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
        <AddSection />
        <EditSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "admin",
      "news",
    ])),
  },
});

export default AdminNews;
