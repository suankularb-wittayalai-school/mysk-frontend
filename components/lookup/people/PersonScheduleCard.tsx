// Imports
import LookupScheduleCard from "@/components/lookup/LookupScheduleCard";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import { StylableFC } from "@/utils/types/common";
import { Person, Student, Teacher, UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

/**
 * A Card that contains the Schedule of a Student or Teacher.
 *
 * @param person The Student or Teacher to show the schedule of.
 * @param open If the Card is open and shown.
 */
const PersonScheduleCard: StylableFC<{
  person: Pick<Person, "id"> &
    (Pick<Student, "role" | "classroom"> | Pick<Teacher, "role">);
  open?: boolean;
}> = ({ person, open, style, className }) => {
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  const [schedule, setSchedule] = useState<ScheduleType>(
    createEmptySchedule(1, 5),
  );

  // Fetch schedule when open
  useEffect(() => {
    if (!(open && loading)) return;
    if (person.role === "student" && !person.classroom) return;
    (async () => {
      const { data } = await (person.role === UserRole.teacher
        ? getTeacherSchedule(supabase, person.id)
        : getClassSchedule(supabase, person.classroom!.id));
      if (data) setSchedule(data);
      setLoading(false);
      return true;
    })();
  }, [open]);

  return (
    <LookupScheduleCard
      schedule={schedule}
      role={person.role}
      open={open}
      loading={loading}
      style={style}
      className={className}
    />
  );
};

export default PersonScheduleCard;
