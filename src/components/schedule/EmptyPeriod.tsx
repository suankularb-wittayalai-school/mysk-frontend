// Components
import AddableEmptyPeriod from "@components/schedule/AddableEmptyPeriod";

// Types
import { Role } from "@utils/types/person";

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
        className={`h-[3.75rem] w-full rounded-lg ${
          isInSession ? "border-4 border-secondary" : "border-2 border-outline"
        }`}
      />
    );
};

export default EmptyPeriod;
