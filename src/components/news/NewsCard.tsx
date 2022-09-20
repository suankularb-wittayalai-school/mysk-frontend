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

// Components
import NewsIcon from "@components/icons/NewsIcon";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemNoDate } from "@utils/types/news";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

const NewsStatus = ({
  newsItem,
}: {
  newsItem: NewsItemNoDate;
}): JSX.Element => {
  return (
    <div
      className={`${
        newsItem.done
          ? "container-primary"
          : (newsItem.type == "form" || newsItem.type == "payment") &&
            newsItem.dueDate &&
            isPast(new Date(newsItem.dueDate))
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

const NewsChipList = ({
  newsItem,
}: {
  newsItem: NewsItemNoDate;
}): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as LangCode;

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
          (isPast(new Date(newsItem.dueDate)) ? (
            <Chip
              name={formatDistanceToNowStrict(new Date(newsItem.dueDate), {
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
                    dueDate: new Date(newsItem.dueDate).toLocaleDateString(
                      locale,
                      { month: "short", day: "numeric" }
                    ),
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
  newsItem: NewsItemNoDate;
  editable?: boolean;
  showChips?: boolean;
  btnType?: "filled" | "outlined" | "text" | "tonal";
}): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as LangCode;

  return (
    <Card type="stacked" appearance="outlined">
      <CardHeader
        icon={<NewsIcon type={newsItem.type} className="text-secondary" />}
        title={
          <h3 className="text-lg font-medium">
            {getLocaleString(newsItem.content.title, locale)}
          </h3>
        }
        label={
          <div className="flex divide-x divide-outline">
            <span className="pr-2">{t(`itemType.${newsItem.type}`)}</span>
            <time className="pl-2 text-outline">
              {new Date(newsItem.postDate).toLocaleDateString(locale, {
                year: isThisYear(new Date(newsItem.postDate))
                  ? undefined
                  : "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        }
        end={
          ["info", "stats"].includes(newsItem.type) ? undefined : (
            <div>
              <NewsStatus newsItem={newsItem} />
            </div>
          )
        }
        className="font-display"
      />
      {showChips && newsItem.type != "info" && (
        <div className="overflow-x-auto py-1 px-4">
          <NewsChipList newsItem={newsItem} />
        </div>
      )}
      <CardSupportingText>
        <p className="max-lines-2">
          {getLocaleString(newsItem.content.description, locale)}
        </p>
      </CardSupportingText>
      <CardActions>
        {editable ? (
          <LinkButton
            label={t("itemAction.edit")}
            type={btnType || "filled"}
            url={`/admin/news/edit/${newsItem.type}/${newsItem.id}`}
            LinkElement={Link}
          />
        ) : (
          <LinkButton
            label={t(
              `itemAction.${newsItem.type}${
                ["info", "stats"].includes(newsItem.type)
                  ? ""
                  : `.${newsItem.done ? "edit" : "do"}`
              }`
            )}
            type={btnType || "filled"}
            url={`/news/${newsItem.type}/${newsItem.id}`}
            LinkElement={Link}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default NewsCard;
