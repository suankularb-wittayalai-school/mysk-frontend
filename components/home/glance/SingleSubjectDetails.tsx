import PersonChipSet from "@/components/person/PeopleChipSet";
import RoomChip from "@/components/room/RoomChip";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  Card,
  CardContent,
  CardHeader,
  ChipSet,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { sift } from "radash";

/**
 * The details of a single Subject in a Schedule Period.
 *
 * @param period The Period Content Item to display the details of.
 */
const SingleSubjectDetails: StylableFC<{
  period: PeriodContentItem;
}> = ({ period, style, className }) => {
  const { t } = useTranslation("schedule/common");
  const rooms = period.rooms ? sift(period.rooms) : [];

  return (
    <div
      style={style}
      className={cn(
        `grid grid-cols-2 gap-2 *:space-y-1 *:bg-surface-bright`,
        className,
      )}
    >
      {/* Teachers */}
      <Card appearance="filled">
        <CardHeader title={t("subject.teachers")} />
        <CardContent>
          <PersonChipSet
            scrollable
            people={period.teachers.map((teacher) => ({
              role: UserRole.teacher,
              ...teacher,
            }))}
            className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
          />
        </CardContent>
      </Card>

      {/* Room */}
      {rooms.length > 0 && (
        <Card appearance="filled">
          <CardHeader title={t("subject.room")} />
          <CardContent>
            <ChipSet scrollable className="fade-out-to-r -mx-3 *:pl-3 *:pr-8">
              {rooms.map((room) => (
                <RoomChip key={room} room={room} />
              ))}
            </ChipSet>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SingleSubjectDetails;
