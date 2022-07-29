// Modules
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  ChipFilterList,
  Header,
  MaterialIcon,
  Section,
  XScrollContent,
  LinkButton,
} from "@suankularb-components/react";

// Components
import NewsCard from "@components/news/NewsCard";

// Types
import { NewsListNoDate } from "@utils/types/news";

const NewsSection = ({
  news,
  showFilters,
}: {
  news: NewsListNoDate;
  showFilters?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<NewsListNoDate>(news);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="newspaper" allowCustomSize={true} />}
        text={t("news.title")}
      />
      {showFilters && (
        <ChipFilterList
          choices={[
            { id: "news", name: t("news.filter.news") },
            { id: "form", name: t("news.filter.forms") },
            { id: "payment", name: t("news.filter.payments") },
            [
              { id: "not-done", name: t("news.filter.amountDone.notDone") },
              { id: "done", name: t("news.filter.amountDone.done") },
            ],
          ]}
          onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
          scrollable={true}
        />
      )}
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li className="grid h-[13.75rem] place-content-center rounded-xl bg-surface-1 text-center text-on-surface">
            {t("news.noRelevantNews")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((newsItem) => (
            <li key={newsItem.id}>
              <NewsCard newsItem={newsItem} btnType="tonal" />
            </li>
          ))}
        </XScrollContent>
      )}
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("news.action.seeAll")}
          type="filled"
          url="/news"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default NewsSection;
