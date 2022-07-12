// Modules
import { formatDistanceToNowStrict, isPast, isThisYear } from "date-fns";
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
import { NewsItem, NewsItemType } from "@utils/types/news";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

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
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <ChipList noWrap>
      {
        // Payment
        newsItem.type == "payment" && newsItem.amount && (
          <Chip
            name={newsItem.amount.toLocaleString(locale, {
              style: "currency",
              currency: "THB",
            })}
            leadingIcon={
              <MaterialIcon icon="payments" className="text-primary" />
            }
          />
        )
      }
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
              name={t(`itemFrequency.${newsItem.frequency || "repeating"}`)}
              leadingIcon={
                <MaterialIcon icon="repeat" className="text-primary" />
              }
            />
          ))
      }
      {
        // Due date
        (newsItem.type == "form" || newsItem.type == "payment") &&
          newsItem.dueDate &&
          (isPast(newsItem.dueDate) ? (
            <Chip
              name={formatDistanceToNowStrict(newsItem.dueDate, {
                addSuffix: true,
                locale: locale == "en-US" ? enUS : th,
              })}
              leadingIcon={
                <MaterialIcon icon="calendar_today" className="text-error" />
              }
              selected
              className="!bg-error-container !text-on-error-container"
            />
          ) : (
            <Chip
              name={
                <Trans i18nKey="itemDue.dueWithin" ns="news">
                  {{
                    dueDate: newsItem.dueDate.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    }),
                  }}
                </Trans>
              }
              leadingIcon={
                <MaterialIcon icon="calendar_today" className="text-primary" />
              }
            />
          ))
      }
    </ChipList>
  );
};

const NewsCard = ({
  newsItem,
  editable,
  showChips,
  btnType,
}: {
  newsItem: NewsItem;
  editable?: boolean;
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
            {getLocaleString(newsItem.content.title, locale)}
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
      {showChips && newsItem.type != "info" && (
        <div className="mx-[2px] overflow-x-auto py-1 px-[calc(1rem-2px)]">
          <NewsChipList newsItem={newsItem} />
        </div>
      )}
      <CardSupportingText>
        <p className="max-lines-2">
          {getLocaleString(newsItem.content.description, locale)}
        </p>
      </CardSupportingText>
      <CardActions>
        <LinkButton
          label={t(
            `itemAction.${newsItem.type}${
              (["info", "stats"] as NewsItemType[]).includes(newsItem.type)
                ? ""
                : `.${newsItem.done ? "edit" : "do"}`
            }`
          )}
          type={btnType || "filled"}
          url={`/${newsItem.type}/${newsItem.id}`}
          LinkElement={Link}
        />
      </CardActions>
    </Card>
  );
};

export default NewsCard;
