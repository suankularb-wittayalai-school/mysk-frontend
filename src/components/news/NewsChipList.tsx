// Modules
import { isPast, formatDistanceToNowStrict } from "date-fns";
import { enUS, th } from "date-fns/locale";

import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

// SK Components
import { ChipList, Chip, MaterialIcon } from "@suankularb-components/react";

// Types
import { NewsMetadata } from "@utils/types/news";

const NewsChipList = ({
  newsMeta,
}: {
  newsMeta: NewsMetadata;
}): JSX.Element => {
  const { t } = useTranslation("news");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <ChipList noWrap>
      {
        // Payment
        newsMeta.amount && (
          <Chip
            name={newsMeta.amount.toLocaleString(locale, {
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
        newsMeta.frequency == "once" ? (
          <Chip
            name={t(`itemFrequency.once`)}
            leadingIcon={
              <MaterialIcon icon="looks_one" className="text-primary" />
            }
          />
        ) : (
          // Repeated
          <Chip
            name={t(`itemFrequency.${newsMeta.frequency || "repeating"}`)}
            leadingIcon={
              <MaterialIcon icon="repeat" className="text-primary" />
            }
          />
        )
      }
      {
        // Due date
        newsMeta.dueDate &&
          (isPast(newsMeta.dueDate) ? (
            <Chip
              name={formatDistanceToNowStrict(newsMeta.dueDate, {
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
              name={t("itemDue.dueWithin", {
                dueDate: newsMeta.dueDate.toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                }),
              })}
              leadingIcon={
                <MaterialIcon icon="calendar_today" className="text-primary" />
              }
            />
          ))
      }
    </ChipList>
  );
};

export default NewsChipList;
