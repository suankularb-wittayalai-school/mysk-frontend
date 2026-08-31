import { CheerAttendanceEvent } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { TabsContainer, Tab, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * Tabs for switching between Assembly and Homeroom Attendance.
 *
 * @param event The currently shown Attendance Event.
 * @param onEventChange Should change the current Attendance Event.
 * @param isJatu Whether today is Jatu day.
 * @param isPerformingCardStunt Whether the class is performing card stunt or carry plate.
 */
const CheerAttendanceEventTabs: StylableFC<{
  event: CheerAttendanceEvent;
  onEventChange: (event: CheerAttendanceEvent) => void;
  isJatu: boolean;
  isPerformingCardStunt: boolean;
}> = ({
  event,
  onEventChange,
  isJatu,
  isPerformingCardStunt,
  style,
  className,
}) => {
  const { t } = useTranslation("attendance/cheer/list");
  return (
    <TabsContainer
      appearance="secondary"
      alt={"title"}
      style={style}
      className={className}
    >
      <Tab
        icon={
          <MaterialIcon
            icon={
              isPerformingCardStunt ? (isJatu ? "apartment" : "flags") : "flags"
            }
          />
        }
        label={t(
          `event.${isPerformingCardStunt ? (isJatu ? "jatu" : "practice") : "practice"}.start`,
        )}
        selected={event == "start"}
        onClick={() => onEventChange("start")}
      />
      <Tab
        icon={
          <MaterialIcon
            icon={
              isPerformingCardStunt
                ? isJatu
                  ? "directions_bus"
                  : "meeting_room"
                : "meeting_room"
            }
          />
        }
        label={t(
          `event.${isPerformingCardStunt ? (isJatu ? "jatu" : "practice") : "practice"}.end`,
        )}
        selected={event == "end"}
        onClick={() => onEventChange("end")}
      />
    </TabsContainer>
  );
};

export default CheerAttendanceEventTabs;
