import { CheerAttendanceEvent } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { TabsContainer, Tab, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

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
