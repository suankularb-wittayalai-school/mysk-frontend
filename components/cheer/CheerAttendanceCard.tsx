import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import { useState } from "react";
import { StylableFC } from "@/utils/types/common";
import { Classroom } from "@/utils/types/classroom";
import {
  CheerAttendanceEvent,
  CheerAttendanceRecord,
} from "@/utils/types/cheer";
import CheerAttendanceEventTabs from "@/components/cheer/CheerAttendanceEventTabs";
import { List, Progress, Text } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import { replace } from "radash";
import useTranslation from "next-translate/useTranslation";
import CheerAttendanceListItem from "@/components/cheer/CheerAttendanceStaffListItem";

const CheerAttendanceCard: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "main_room"> | null;
  attendances: CheerAttendanceRecord[];
  date: string;
  onAttendancesChange: (attendances: CheerAttendanceRecord[]) => void;
  loading: boolean;
}> = ({ classroom, attendances, onAttendancesChange, loading }) => {
  const { t: tx } = useTranslation("common");
  const [event, setEvent] = useState<CheerAttendanceEvent>("start");
  const [saving, setSaving] = useState<boolean>(false);
  return (
    <LookupDetailsCard>
      {classroom && (
        <Text type="headline-medium" element="h2" className="gap-2 p-4">
          {tx("class", { number: classroom.number })}

          <span className="text-on-surface-variant">
            {" • "}
            {classroom.main_room}
          </span>
        </Text>
      )}
      <CheerAttendanceEventTabs
        event={event}
        onEventChange={setEvent}
        className="!-mt-2 !max-w-none sm:!mt-0"
      />
      {loading && (
        <div className="flex h-full w-full items-center justify-center">
          <Progress
            appearance="circular"
            visible={loading}
            alt="loading"
            className=""
          />
        </div>
      )}
      <List
        className={cn(
          loading && `*:*:animate-pulse`,
          `!mt-1 !overflow-y-auto *:bg-surface sm:!-mx-4 md:!m-0 md:space-y-1 md:!p-2 *:md:rounded-md`,
        )}
      >
        {attendances.map((attendance) => (
          <CheerAttendanceListItem
            key={attendance.student.id}
            attendance={attendance}
            shownEvent={event}
            editable={!loading}
            saving={saving}
            setSaving={setSaving}
            onAttendanceChange={(attendance) =>
              onAttendancesChange(
                replace(
                  attendances,
                  attendance,
                  (item) => attendance.student!.id === item.student!.id,
                ),
              )
            }
          />
        ))}
      </List>
    </LookupDetailsCard>
  );
};

export default CheerAttendanceCard;
