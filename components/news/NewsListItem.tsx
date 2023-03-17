// External libraries
import { formatDistanceToNowStrict, isPast } from "date-fns";
import { enUS, th } from "date-fns/locale";

import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC } from "react";

// SK Components
import {
  InputChip,
  ChipSet,
  Columns,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import NewsIcon from "@/components/news/NewsIcon";

// Animations
import { enterPageTransition } from "@/utils/animations/config";

// Types
import { LangCode } from "@/utils/types/common";
import { NewsItemNoDate } from "@/utils/types/news";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";

const NewsStatus = ({
  newsItem,
}: {
  newsItem: NewsItemNoDate;
}): JSX.Element => {
  return (
    <div
      className={`${
        newsItem.done
          ? "bg-primary-container text-on-primary-container"
          : (newsItem.type == "form" || newsItem.type == "payment") &&
            newsItem.dueDate &&
            isPast(new Date(newsItem.dueDate))
          ? "bg-error text-on-error"
          : "bg-tertiary-container text-on-tertiary-container"
      } grid aspect-square w-10 place-content-center rounded-md`}
    >
      {newsItem.done ? (
        <MaterialIcon icon="done" />
      ) : (
        <MaterialIcon icon="close" />
      )}
    </div>
  );
};

const NewsChipSet = ({
  newsItem,
}: {
  newsItem: NewsItemNoDate;
}): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as LangCode;

  return (
    <ChipSet>
      {
        // Payment
        newsItem.type == "payment" && newsItem.amount && (
          <InputChip icon={<MaterialIcon icon="payments" />}>
            {newsItem.amount.toLocaleString(locale, {
              style: "currency",
              currency: "THB",
            })}
          </InputChip>
        )
      }
      {
        // Frequency
        newsItem.type == "form" &&
          // Once
          (newsItem.frequency == "once" ? (
            <InputChip
              icon={<MaterialIcon icon="looks_one" className="text-primary" />}
            >
              {t(`itemFrequency.once`)}
            </InputChip>
          ) : (
            // Repeated
            <InputChip
              icon={<MaterialIcon icon="repeat" className="text-primary" />}
            >
              {t(`itemFrequency.${newsItem.frequency || "repeating"}`)}
            </InputChip>
          ))
      }
      {
        // Due date
        (newsItem.type == "form" || newsItem.type == "payment") &&
          newsItem.dueDate &&
          (isPast(new Date(newsItem.dueDate)) ? (
            <InputChip
              icon={
                <MaterialIcon icon="calendar_today" className="text-error" />
              }
              selected
              className="!bg-error-container !text-on-error-container"
            >
              {formatDistanceToNowStrict(new Date(newsItem.dueDate), {
                addSuffix: true,
                locale: locale == "en-US" ? enUS : th,
              })}
            </InputChip>
          ) : (
            <InputChip
              icon={
                <MaterialIcon icon="calendar_today" className="text-primary" />
              }
            >
              {t("itemDue.dueWithin", {
                dueDate: new Date(newsItem.dueDate).toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                }),
              })}
            </InputChip>
          ))
      }
    </ChipSet>
  );
};

const NewsListItem: FC<{
  newsItem: NewsItemNoDate;
  editable?: boolean;
  showChips?: boolean;
}> = ({ newsItem, editable, showChips }) => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as LangCode;

  return (
    <Link
      href={
        editable
          ? `/admin/news/edit/${newsItem.type}/${newsItem.id}`
          : `/news/${newsItem.type}/${newsItem.id}`
      }
      className="has-action sm:py-2"
    >
      <Columns columns={4}>
        {/* Image */}
        {newsItem.image && (
          <motion.div
            layoutId={["news", newsItem.type, newsItem.id].join("-")}
            transition={enterPageTransition}
            className="surface-variant relative aspect-video w-full
              overflow-hidden sm:rounded-lg"
          >
            <Image src={newsItem.image} fill alt="" className="object-cover" />
          </motion.div>
        )}

        {/* Text section */}
        <div
          className={[
            "flex flex-col-reverse items-start gap-x-2 p-4 sm:px-0 md:flex-row",
            newsItem.image ? "md:col-span-3" : "sm:col-span-2 md:col-span-4",
          ].join(" ")}
        >
          <div className="flex w-full flex-col gap-2">
            {/* Title */}
            <h3 className="skc-headline-small">
              {getLocaleString(newsItem.content.title, locale)}
            </h3>

            {/* Subtitle */}
            <p className="skc-title-medium !font-regular">
              {getLocaleString(newsItem.content.description, locale)}
            </p>

            {/* Chip list */}
            {showChips && newsItem.type != "info" && (
              <NewsChipSet newsItem={newsItem} />
            )}

            {/* Author and date */}
            <div className="flex flex-row divide-x divide-outline">
              <time className="text-outline">
                {new Date(newsItem.postDate).toLocaleDateString(locale, {
                  year: locale == "en-US" ? "numeric" : "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          {/* Icons */}
          <div
            className="flex w-full flex-row items-center justify-between
                gap-8 md:w-fit md:justify-start"
          >
            {/* Type */}
            <div className="flex flex-row-reverse gap-2 sm:flex-row">
              <span className="skc-title-medium">{t(`itemType.${newsItem.type}`)}</span>
              <NewsIcon type={newsItem.type} className="text-secondary" />
            </div>

            {/* Status */}
            {["info", "stats"].includes(newsItem.type) ? undefined : (
              <NewsStatus newsItem={newsItem} />
            )}
          </div>
        </div>
      </Columns>
    </Link>
  );
};

export default NewsListItem;
