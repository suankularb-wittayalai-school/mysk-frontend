// Imports
import CurrentTeachingPeriodCard from "@/components/lookup/teachers/CurrentTeachingPeriodCard";
import TeacherHeader from "@/components/lookup/teachers/TeacherHeader";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import {
  Progress,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TeacherDetailsCard: StylableFC<{
  id?: string;
}> = ({ id, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    withLoading(
      async () => {
        if (!id) {
          setTeacher(null);
          return false;
        }

        const { data, error } = await getTeacherByID(supabase, id, {
          detailed: true,
          includeContacts: true,
        });
        if (error) return false;

        setTeacher(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [id]);

  return (
    <div
      style={style}
      className={cn(
        `relative flex h-full flex-col overflow-auto rounded-lg bg-surface-3
        md:overflow-hidden`,
        className,
      )}
    >
      <Progress
        appearance="linear"
        alt="Loading teacher…"
        visible={loading}
        className="absolute inset-0 bottom-auto"
      />
      <AnimatePresence>
        {teacher && (
          <>
            <TeacherHeader teacher={teacher} />
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(
                duration.medium2,
                easing.standardDecelerate,
              )}
              className={cn(`flex grow-0 flex-col gap-4 rounded-[inherit]
                bg-surface-1 p-4 md:grow md:overflow-auto`)}
            >
              <CurrentTeachingPeriodCard teacherID={teacher.id} />
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDetailsCard;
