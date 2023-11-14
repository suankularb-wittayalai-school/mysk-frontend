// Imports
import CurrentPeriodCard from "@/components/lookup/people/CurrentPeriodCard";
import getCurrentPeriodOfClass from "@/utils/backend/schedule/getCurrentPeriodOfClass";
import { StylableFC } from "@/utils/types/common";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

/**
 * An implementation of Current Period Card for Search Teachers.
 *
 * @param teacherID The ID of the Teacher to get the current period of.
 * @param onClick Triggers when the Card is clicked. Should open the Schedule.
 */
const CurrentLearningPeriodCard: StylableFC<{
  classroomID: string;
  onClick: () => void;
}> = ({ classroomID, onClick, style, className }) => {
  const supabase = useSupabaseClient();

  return (
    <CurrentPeriodCard
      role="student"
      getCurrentPeriod={async () => {
        const { data } = await getCurrentPeriodOfClass(supabase, classroomID);
        return data;
      }}
      onClick={onClick}
      style={style}
      className={className}
    />
  );
};

export default CurrentLearningPeriodCard;