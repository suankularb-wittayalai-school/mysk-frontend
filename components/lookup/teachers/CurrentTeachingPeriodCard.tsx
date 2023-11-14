// Imports
import CurrentPeriodCard from "@/components/lookup/people/CurrentPeriodCard";
import getCurrentPeriodByTeacherID from "@/utils/backend/schedule/getCurrentPeriodByTeacherID";
import { StylableFC } from "@/utils/types/common";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

/**
 * An implementation of Current Period Card for Search Teachers.
 * 
 * @param teacherID The ID of the Teacher to get the current period of.
 * @param onClick Triggers when the Card is clicked. Should open the Schedule.
 */
const CurrentTeachingPeriodCard: StylableFC<{
  teacherID: string;
  onClick: () => void;
}> = ({ teacherID, onClick, style, className }) => {
  const supabase = useSupabaseClient();

  return (
    <CurrentPeriodCard
      getCurrentPeriod={async () => {
        const { data } = await getCurrentPeriodByTeacherID(supabase, teacherID);
        return data;
      }}
      onClick={onClick}
      style={style}
      className={className}
    />
  );
};

export default CurrentTeachingPeriodCard;
