// Modules
import { isPast, isThisYear } from "date-fns";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import NewsChipList from "@components/news/NewsChipList";

// Types
import { NewsItem } from "@utils/types/news";

const NewsStatus = ({ newsItem }: { newsItem: NewsItem }): JSX.Element => {
  return (
    <div
      className={`${
        newsItem.done
          ? "container-primary"
          : (newsItem.type == "form" || newsItem.type == "payment") &&
            newsItem.dueDate &&
            isPast(newsItem.dueDate)
          ? "bg-error text-on-error"
          : "container-tertiary"
      } grid aspect-square w-10 place-content-center rounded-lg`}
    >
      {newsItem.done ? (
        <MaterialIcon icon="done" />
      ) : (
        <MaterialIcon icon="close" />
      )}
    </div>
  );
};

const NewsCard = ({
  newsItem,
  showChips,
  btnType,
}: {
  newsItem: NewsItem;
  showChips?: boolean;
  btnType?: "filled" | "outlined" | "text" | "tonal";
}): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Card type="stacked" appearance="outlined">
      <CardHeader
        icon={
          newsItem.type == "form" ? (
            <MaterialIcon icon="edit" className="text-secondary" />
          ) : newsItem.type == "payment" ? (
            <MaterialIcon icon="account_balance" className="text-secondary" />
          ) : (
            <MaterialIcon icon="information" className="text-secondary" />
          )
        }
        title={
          <h3 className="text-lg font-medium">
            {newsItem.content[locale].title}
          </h3>
        }
        label={
          <div className="flex divide-x divide-outline">
            <span className="pr-2">{t(`itemType.${newsItem.type}`)}</span>
            <time className="pl-2 text-outline">
              {newsItem.postDate.toLocaleDateString(locale, {
                year: isThisYear(newsItem.postDate) ? undefined : "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        }
        end={
          ["news", "stats"].includes(newsItem.type) ? undefined : (
            <div>
              <NewsStatus newsItem={newsItem} />
            </div>
          )
        }
        className="font-display"
      />
      {showChips && newsItem.type != "news" && (
        <div className="mx-[2px] overflow-x-auto py-1 px-[calc(1rem-2px)]">
          <NewsChipList
            newsMeta={{
              frequency:
                newsItem.type == "form" ? newsItem.frequency : undefined,
              amount: newsItem.type == "payment" ? newsItem.amount : undefined,
              dueDate:
                newsItem.type == "form" || newsItem.type == "payment"
                  ? newsItem.dueDate
                  : undefined,
              done:
                newsItem.type == "form" || newsItem.type == "payment"
                  ? newsItem.done
                  : undefined,
            }}
          />
        </div>
      )}
      <CardSupportingText>
        <p className="max-lines-2">{newsItem.content[locale].supportingText}</p>
      </CardSupportingText>
      <CardActions>
        <LinkButton
          label={t(
            `itemAction.${newsItem.type}${
              ["news", "stats"].includes(newsItem.type)
                ? ""
                : `.${newsItem.done ? "edit" : "do"}`
            }`
          )}
          type={btnType || "filled"}
          url={`/s/${newsItem.type}/${newsItem.id}`}
          LinkElement={Link}
        />
      </CardActions>
    </Card>
  );
};

export default NewsCard;
