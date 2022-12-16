// // External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  Card,
  CardHeader,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import NewsFeed from "@components/news/NewsFeed";
import NewsFilter from "@components/news/NewsFilter";

// Backend
import { getNewsFeed } from "@utils/backend/news";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemType, NewsListNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

// Page
const NewsPage: NextPage<{ role: Role; newsFeed: NewsListNoDate }> = ({
  role,
  newsFeed,
}): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);

  const [newsFilter, setNewsFilter] = useState<NewsItemType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsListNoDate>(newsFeed);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title.title"),
              subtitle: t("title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="newspaper" />}
            backGoesTo={role == "teacher" ? "/teach" : "/learn"}
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Link href="/news/orders">
              <a>
                <Card type="horizontal" hasAction>
                  <CardHeader
                    icon={<MaterialIcon icon="inbox" />}
                    title={<h3>{t("orders.title")}</h3>}
                    label={<span>{t("orders.newNotice", { count: 2 })}</span>}
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
            <Link href="/news/documents">
              <a>
                <Card type="horizontal" hasAction>
                  <CardHeader
                    icon={<MaterialIcon icon="drafts" />}
                    title={<h3>{t("documents.title")}</h3>}
                    label={
                      <span>{t("documents.newNotice", { count: 1 })}</span>
                    }
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
          </LayoutGridCols>
        </Section>
        <Section>
          {/* TODO: Make filtering News a reality! */}
          {/* <NewsFilter setNewsFilter={setNewsFilter} /> */}
          <NewsFeed news={filteredNews} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await supabase.auth.getUser();
  const role = user.user?.user_metadata.role;

  const { data: newsFeed } = await getNewsFeed(role);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      role,
      newsFeed,
    },
  };
};

export default NewsPage;
