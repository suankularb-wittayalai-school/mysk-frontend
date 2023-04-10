// External libraries
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

// SK Components
import {
  AssistChip,
  ChipSet,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student, Teacher } from "@/utils/types/person";
import { nameJoiner } from "@/utils/helpers/name";

const PersonHeader: FC<{ person?: Student | Teacher }> = ({ person }) => {
  const locale = useLocale();

  return (
    <div className="sticky flex flex-row gap-6 bg-surface-2 px-5 py-4">
      <DynamicAvatar className="!h-14 !w-14" />
      <div className="flex flex-col gap-2">
        <h2 className="skc-display-small">
          {person ? nameJoiner(locale, person.name) : "Loading…"}
        </h2>
        <ChipSet>
          <AssistChip icon={<MaterialIcon icon="groups" />} element={Link}>
            See class
          </AssistChip>
          {(person?.role === "student" ||
            (person?.role === "teacher" && person.classAdvisorAt)) && (
            <AssistChip
              icon={<MaterialIcon icon="dashboard" />}
              href={`/lookup/class/${
                (person.role === "student"
                  ? person.class
                  : person.role === "teacher" && person.classAdvisorAt
                  ? person.classAdvisorAt
                  : undefined
                )?.number
              }/schedule`}
              element={Link}
            >
              See schedule
            </AssistChip>
          )}
          <AssistChip icon={<MaterialIcon icon="share" />}>Share</AssistChip>
        </ChipSet>
      </div>
    </div>
  );
};

export default PersonHeader;
