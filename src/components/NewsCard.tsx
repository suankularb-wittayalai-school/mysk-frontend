// Modules
import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isPast,
  isThisYear,
} from "date-fns";
import { enUS, th } from "date-fns/locale";

import Link from "next/link";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Chip,
  ChipList,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

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

const NewsChipList = ({ newsItem }: { newsItem: NewsItem }): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <ChipList noWrap>
      {
        // Frequency
        newsItem.type == "form" &&
          // Once
          (newsItem.frequency == "once" ? (
            <Chip
              name={t(`itemFrequency.once`)}
              leadingIcon={
                <MaterialIcon icon="looks_one" className="text-primary" />
              }
            />
          ) : (
            // Repeated
            <Chip
              name={t(`itemsFrequency.${newsItem.frequency || "repeating"}`)}
              leadingIcon={
                <MaterialIcon icon="repeat" className="text-primary" />
              }
            />
          ))
      }
      {
        // Due date
        (newsItem.type == "form" || newsItem.type == "payment") &&
          newsItem.dueDate && (
            <Chip
              name={
                <Trans i18nKey="itemDue.pastDueBy" ns="news">
                  {{
                    dueDate: newsItem.dueDate.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    }),
                    timePast: formatDistanceToNowStrict(newsItem.dueDate, {
                      locale: locale == "en-US" ? enUS : th,
                    }),
                  }}
                </Trans>
              }
              leadingIcon={
                <MaterialIcon icon="calendar_today" className="text-primary" />
              }
            />
          )
      }
    </ChipList>
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
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

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
          newsItem.type != "news" ? (
            <NewsStatus newsItem={newsItem} />
          ) : undefined
        }
        className="font-display"
      />
      {showChips && (
        <div className="mx-[2px] overflow-x-auto px-[calc(1rem-2px)]">
          <NewsChipList newsItem={newsItem} />
        </div>
      )}
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
          type={btnType || "filled"}
          url={`/${newsItem.type}/${newsItem.id}`}
          LinkElement={Link}
          // className="container-secondary"
        />
      </CardActions>
    </Card>
  );
};

export default NewsCard;
