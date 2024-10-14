import { AttendanceEvent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Tab, TabsContainer } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * Tabs for switching between Assembly and Homeroom Attendance.
 *
 * @param event The currently shown Attendance Event.
 * @param onEventChange Should change the current Attendance Event.
 */
const AttendanceEventTabs: StylableFC<{
  event: AttendanceEvent;
  onEventChange: (event: AttendanceEvent) => void;
}> = ({ event, onEventChange, style, className }) => {
  const { t } = useTranslation("attendance/common");

  return (
    <TabsContainer
      appearance="secondary"
      alt={t("event.title")}
      style={style}
      className={className}
    >
      <Tab
        icon={<MaterialIcon icon="flags" />}
        label={t("event.assembly")}
        selected={event === "assembly"}
        onClick={() => onEventChange("assembly")}
      />
      <Tab
        icon={<MaterialIcon icon="meeting_room" />}
        label={t("event.homeroom")}
        selected={event === "homeroom"}
        onClick={() => onEventChange("homeroom")}
      />
    </TabsContainer>
  );
};

export default AttendanceEventTabs;
