// Modules
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode } from "react";

// SK Components
import { RegularLayout, Title } from "@suankularb-components/react";

// Components
import NewsTypeIcon from "@components/news/NewsTypeIcon";

// Utils
import { NewsItemType } from "@utils/types/news";

const NewsWrapper = ({
  title,
  type,
  children,
}: {
  title: {
    "en-US"?: string;
    th: string;
  };
  type: NewsItemType;
  children: ReactNode;
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";
  const { t } = useTranslation("news");

  return (
    <RegularLayout
      Title={
        <Title
          name={{
            title: title[locale] ?? title.th,
            subtitle: t(`itemType.${type}`),
          }}
          pageIcon={<NewsTypeIcon type={type} />}
          backGoesTo="/s/home"
          LinkElement={Link}
        />
      }
    >
      {children}
    </RegularLayout>
  );
};

export default NewsWrapper;
