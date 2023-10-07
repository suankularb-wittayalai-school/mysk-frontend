// Imports
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
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
import { useEffect, useState } from "react";
import TeacherHeader from "./TeacherHeader";
import { AnimatePresence, motion } from "framer-motion";
import cn from "@/utils/helpers/cn";

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
      className={cn(`relative flex h-full flex-col overflow-hidden rounded-lg
        bg-surface-3`)}
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
              className="grow rounded-[inherit] bg-surface-1"
            ></motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDetailsCard;
