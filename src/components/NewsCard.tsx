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

// Types
import { NewsItem } from "@utils/types/news";

const NewsCard = ({ newsItem }: { newsItem: NewsItem }): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Card type="stacked" appearance="outlined">
      <CardHeader
        icon={
          newsItem.type == "form" ? (
            <MaterialIcon icon="edit" />
          ) : newsItem.type == "payment" ? (
            <MaterialIcon icon="account_balance" />
          ) : (
            <MaterialIcon icon="information" />
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
          newsItem.type != "news" ? (
            <div
              className={`${
                newsItem.done
                  ? "container-primary"
                  : (newsItem.type == "form" || newsItem.type == "payment") &&
                    newsItem.dueDate &&
                    isPast(newsItem.dueDate)
                  ? "bg-error text-on-error"
                  : "container-tertiary"
              } grid aspect-square w-10 place-content-center rounded-xl`}
            >
              {newsItem.done ? (
                <MaterialIcon icon="done" />
              ) : (
                <MaterialIcon icon="close" />
              )}
            </div>
          ) : undefined
        }
        className="font-display"
      />
      <CardSupportingText>
        <p className="max-lines-2">
          {newsItem.content[locale == "en-US" ? "en-US" : "th"].supportingText}
        </p>
      </CardSupportingText>
      <CardActions>
        <LinkButton
          name={t(
            `itemAction.${newsItem.type}${
              newsItem.type != "news" ? `.${newsItem.done ? "edit" : "do"}` : ""
            }`
          )}
          type="filled"
          url={`/${newsItem.type}/${newsItem.id}`}
          LinkElement={Link}
          className="container-secondary"
        />
      </CardActions>
    </Card>
  );
};

export default NewsCard;
