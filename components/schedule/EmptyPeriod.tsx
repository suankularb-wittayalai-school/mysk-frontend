// Internal components
import AddableEmptyPeriod from "@/components/schedule/AddableEmptyPeriod";

// Types
import { Role } from "@/utils/types/person";

const EmptyPeriod = ({
  isInSession,
  day,
  startTime,
  role,
  allowEdit,
  setAddPeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  startTime: number;
  role: Role;
  allowEdit?: boolean;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
  toggleFetched?: () => void;
}): JSX.Element => {
  if (role == "teacher" && allowEdit)
    return (
      <AddableEmptyPeriod
        isInSession={isInSession}
        day={day}
        startTime={startTime}
        setAddPeriod={setAddPeriod}
        toggleFetched={toggleFetched}
      />
    );
  else
    return (
      <div
        className={`h-14 w-full rounded-sm ${
          isInSession
            ? "border-4 border-secondary"
            : "border-[1px] border-outline-variant"
        }`}
      />
    );
};

export default EmptyPeriod;
