// External libraries
import { isPast } from "date-fns";

import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC } from "react";

// SK Components
import {
  Columns,
  MaterialIcon,
  ListItem,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import NewsChipSet from "@/components/news/NewsChipSet";
import NewsIcon from "@/components/news/NewsIcon";

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

const NewsListItem: FC<{
  newsItem: NewsItemNoDate;
  editable?: boolean;
  showChips?: boolean;
}> = ({ newsItem, editable, showChips }) => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale as LangCode;

  const { duration, easing } = useAnimationConfig();

  return (
    <ListItem
      align="top"
      lines={3}
      stateLayerEffect
      href={
        editable
          ? `/admin/news/edit/${newsItem.type}/${newsItem.id}`
          : `/news/${newsItem.type}/${newsItem.id}`
      }
      element={Link}
      className="!p-0"
    >
      <Columns columns={4} className="w-full">
        {/* Image */}
        {newsItem.image && (
          <motion.div
            layoutId={["news", newsItem.type, newsItem.id].join("-")}
            transition={transition(duration.medium4, easing.standardAccelerate)}
            className="surface-variant relative aspect-video w-full
              overflow-hidden sm:rounded-lg"
          >
            <Image src={newsItem.image} fill alt="" className="object-cover" />
          </motion.div>
        )}

        {/* Text section */}
        <div
          className={[
            "flex flex-col-reverse items-start gap-x-2 p-4 md:flex-row",
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
              <span className="skc-title-medium">
                {t(`itemType.${newsItem.type}`)}
              </span>
              <NewsIcon type={newsItem.type} className="text-secondary" />
            </div>

            {/* Status */}
            {["info", "stats"].includes(newsItem.type) ? undefined : (
              <NewsStatus newsItem={newsItem} />
            )}
          </div>
        </div>
      </Columns>
    </ListItem>
  );
};

export default NewsListItem;
