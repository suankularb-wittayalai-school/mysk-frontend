import { CheerAttendanceEvent } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { TabsContainer, Tab, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

const CheerAttendanceEventTabs: StylableFC<{
  event: CheerAttendanceEvent;
  onEventChange: (event: CheerAttendanceEvent) => void;
}> = ({ event, onEventChange, style, className }) => {
  const { t } = useTranslation("attendance/cheer/list");
  return (
    <TabsContainer
      appearance="secondary"
      alt={"title"}
      style={style}
      className={className}
    >
      <Tab
        icon={<MaterialIcon icon="flags" />}
        label={t("event.start")}
        selected={event == "start"}
        onClick={() => onEventChange("start")}
      />
      <Tab
        icon={<MaterialIcon icon="meeting_room" />}
        label={t("event.end")}
        selected={event == "end"}
        onClick={() => onEventChange("end")}
      />
    </TabsContainer>
  );
};

export default CheerAttendanceEventTabs;
