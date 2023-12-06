// Imports
import PresenceLegend from "@/components/attendance/PresenceLegend";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import { AttendanceEvent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  MaterialIcon,
  Snackbar,
  Tab,
  TabsContainer,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * The header of the Attendance list.
 *
 * @param event The selected Attendance Event on mobile.
 * @param onEventChange Callback when the Attendance Event is changed on mobile.
 */
const AttendanceListHeader: StylableFC<{
  event: AttendanceEvent;
  onEventChange: (event: AttendanceEvent) => void;
}> = ({ event, onEventChange, style, className }) => {
  const { t } = useTranslation("attendance");

  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <div
      style={style}
      className={cn(
        `-top-8 z-10 flex flex-row items-end gap-x-6 gap-y-3 bg-surface px-4
        py-2 sm:sticky sm:grid sm:grid-cols-2 sm:px-0 md:top-0 md:grid-cols-10`,
        className,
      )}
    >
      <PresenceLegend className="grow sm:col-span-2 md:col-span-4" />
      <div
        className={cn(`contents [&>*]:hidden [&>*]:items-center
          [&>*]:gap-2 [&>*]:sm:flex [&>*]:md:col-span-3`)}
      >
        <div>
          <MaterialIcon
            icon="emoji_flags"
            className="text-on-surface-variant"
          />
          <Text type="title-medium">{t("event.assembly")}</Text>
        </div>
        <div>
          <MaterialIcon
            icon="meeting_room"
            className="text-on-surface-variant"
          />
          <Text type="title-medium">{t("event.homeroom")}</Text>
        </div>
      </div>
      <div className="sm:!hidden [&>*]:!border-0">
        <TabsContainer
          appearance="primary"
          alt={t("event.title")}
          className="!-my-2 !w-28"
        >
          <Tab
            icon={<MaterialIcon icon="emoji_flags" />}
            alt={t("event.assembly")}
            selected={event === "assembly"}
            onClick={() => {
              onEventChange("assembly");
              setSnackbar(
                <Snackbar>{t("event.snackbar.switchedToAssembly")}</Snackbar>,
              );
            }}
          />
          <Tab
            icon={<MaterialIcon icon="meeting_room" />}
            alt={t("event.homeroom")}
            selected={event === "homeroom"}
            onClick={() => {
              onEventChange("homeroom");
              setSnackbar(
                <Snackbar>{t("event.snackbar.switchedToHomeroom")}</Snackbar>,
              );
            }}
          />
        </TabsContainer>
      </div>
    </div>
  );
};

export default AttendanceListHeader;
