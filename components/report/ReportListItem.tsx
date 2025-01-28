import { StylableFC } from "@/utils/types/common";
import { ListItem, ListItemContent } from "@suankularb-components/react";
import { Report } from "@/utils/types/report";
import React from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { format } from "date-fns";
import { enUS, th } from "date-fns/locale";
import useTranslation from "next-translate/useTranslation";

export const ReportListItem: StylableFC<{
  report: Report;
  selected: boolean;
  onClick?: () => void;
}> = ({ report, selected, onClick }) => {
  const locale = useLocale();
  const { t } = useTranslation("report");

  const date = format(report.date, "d MMMM yyyy", {
    locale: locale === "th" ? th : enUS,
  }).replace(/\d{4}/, (year) => (locale === "th" ? `${+year + 543}` : year));

  return (
    <ListItem
      align="top"
      lines={2}
      stateLayerEffect
      onClick={onClick}
      className={`!rounded-sm !py-3 ${selected && "!bg-primary-container"}`}
    >
      <ListItemContent
        title={getLocaleString(report.subject.name, locale)}
        desc={
          report.duration > 1
            ? t("period") +
              " " +
              report.start_time +
              "-" +
              (report.start_time + report.duration - 1) +
              " • " +
              date
            : t("period") + " " + report.start_time + " • " + date
        }
      ></ListItemContent>
    </ListItem>
  );
};
