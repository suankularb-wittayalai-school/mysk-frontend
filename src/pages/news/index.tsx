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

import { FC, useState } from "react";

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
import { getNewSchoolDocumentCount } from "@utils/backend/news/document";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import {
  NewSchoolDocumentCount,
  NewsItemType,
  NewsListNoDate,
} from "@utils/types/news";
import { Role } from "@utils/types/person";

const RelatedPagesSection: FC<{
  newCounts: NewSchoolDocumentCount;
}> = ({ newCounts }) => {
  const { t } = useTranslation("news");

  return (
    <Section>
      <LayoutGridCols cols={3}>
        <Link href="/news/orders/1">
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="inbox" />}
                title={<h3>{t("schoolDocs.orders.title")}</h3>}
                label={
                  <span>
                    {t("schoolDocs.orders.newNotice", {
                      count: newCounts.order,
                    })}
                  </span>
                }
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
        <Link href="/news/documents/1">
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="drafts" />}
                title={<h3>{t("schoolDocs.documents.title")}</h3>}
                label={
                  <span>
                    {t("schoolDocs.documents.newNotice", {
                      count: newCounts.document,
                    })}
                  </span>
                }
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
      </LayoutGridCols>
    </Section>
  );
};

// Page
const NewsPage: NextPage<{
  role: Role;
  newCounts: NewSchoolDocumentCount;
  newsFeed: NewsListNoDate;
}> = ({ role, newCounts, newsFeed }): JSX.Element => {
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
        <RelatedPagesSection newCounts={newCounts} />
        {/* TODO: Make filtering News a reality! */}
        {/* <NewsFilter setNewsFilter={setNewsFilter} /> */}
        <NewsFeed news={filteredNews} />
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

  const { data: newCounts } = await getNewSchoolDocumentCount();
  const { data: newsFeed } = await getNewsFeed(role);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      role,
      newCounts,
      newsFeed,
    },
  };
};

export default NewsPage;
