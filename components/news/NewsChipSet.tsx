// External libraries
import { formatDistanceToNowStrict, isPast } from "date-fns";
import { enUS, th } from "date-fns/locale";

import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

// SK Components
import { InputChip, ChipSet, MaterialIcon } from "@suankularb-components/react";

// Types
import { LangCode } from "@/utils/types/common";
import { NewsItemNoDate } from "@/utils/types/news";

// Helpers

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

export default NewsChipSet;
