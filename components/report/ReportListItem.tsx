import { StylableFC } from "@/utils/types/common";
import { ListItem, ListItemContent } from "@suankularb-components/react";
import { Report } from "@/utils/types/report";
import React from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { format } from "date-fns";
import { bg, enUS, th } from "date-fns/locale";
import cn from "@/utils/helpers/cn";

export const ReportListItem: StylableFC<{
  report: Report;
  selected: boolean;
  onClick?: () => void;
}> = ({ report, selected,onClick }) => {
  const locale = useLocale();

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
        desc={"คาบที่ 4" + " • " + date}
      ></ListItemContent>
    </ListItem>
  );
};
