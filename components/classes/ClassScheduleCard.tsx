// Imports
import LookupScheduleCard from "@/components/lookup/LookupScheduleCard";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

/**
 * A Card that contains the Schedule of a Classroom.
 *
 * @param classroom The Classroom to show the schedule of.
 * @param open If the Card is open and shown.
 */
const ClassScheduleCard: StylableFC<{
  classroom: Pick<Classroom, "id">;
  open?: boolean;
}> = ({ classroom, open, style, className }) => {
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  const [schedule, setSchedule] = useState<ScheduleType>(
    createEmptySchedule(1, 5),
  );

  // Fetch schedule when open
  useEffect(() => {
    if (!(open && loading)) return;
    (async () => {
      const { data } = await getClassSchedule(supabase, classroom.id);
      if (data) setSchedule(data);
      setLoading(false);
    })();
  }, [open]);

  return (
    <LookupScheduleCard
      schedule={schedule}
      role={UserRole.student}
      open={open}
      loading={loading}
      style={style}
      className={className}
    />
  );
};

export default ClassScheduleCard;
