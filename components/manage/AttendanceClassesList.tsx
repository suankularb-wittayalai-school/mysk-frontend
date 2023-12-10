// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { List, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

/**
 * The the Classes Breakdown of the Date Attendance Overview page.
 *
 * @param children Attendance Classes List Items.
 */
const AttendanceClassesList: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => {
  const { t } = useTranslation("manage", { keyPrefix: "attendance.table" });

  return (
    <div
      style={style}
      className={cn(`-mx-4 overflow-x-auto sm:mx-0`, className)}
    >
      <List divided className="min-w-[52rem] print:min-w-0 [&>li>*]:!px-4">
        {/* Header */}
        <li className="!border-b-outline">
          <div className="grid grid-cols-10 gap-6 pb-1">
            <Text type="title-medium" className="col-span-3">
              {t("thead.classroom")}
            </Text>
            <Text
              type="title-medium"
              className="col-span-3 grid min-w-[12rem] grid-cols-3"
            >
              <span>{t("thead.present")}</span>
              <span>{t("thead.late")}</span>
              <span>{t("thead.absent")}</span>
            </Text>
            <Text type="title-medium" className="col-span-4">
              {t("thead.homeroom")}
            </Text>
          </div>
        </li>

        {/* Content */}
        {children}
      </List>
    </div>
  );
};

export default AttendanceClassesList;
