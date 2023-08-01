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

// Types
import { LangCode } from "@/utils/types/common";
import { Info } from "@/utils/types/news";

// Helpers
import { getLocaleString } from "@/utils/helpers/string";

const NewsListItem: FC<{
  newsItem: Info;
  editable?: boolean;
}> = ({ newsItem, editable }) => {
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
          ? `/admin/news/edit/info/${newsItem.id}`
          : `/news/info/${newsItem.id}`
      }
      element={Link}
      className="!p-0"
    >
      <Columns columns={4} className="w-full">
        {/* Image */}
        {newsItem.image && (
          <motion.div
            layoutId={["news", newsItem.id].join("-")}
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
              {getLocaleString(newsItem.title, locale)}
            </h3>

            {/* Subtitle */}
            <p className="skc-title-medium !font-regular">
              {getLocaleString(newsItem.description, locale)}
            </p>

            {/* Author and date */}
            <div className="flex flex-row divide-x divide-outline">
              <time className="text-outline">
                {new Date(newsItem.created_at).toLocaleDateString(locale, {
                  year: locale == "en-US" ? "numeric" : "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>
      </Columns>
    </ListItem>
  );
};

export default NewsListItem;
