// External libraries
import Link from "next/link";
import { FC, useState } from "react";

// SK Components
import {
  AssistChip,
  ChipSet,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";
import ShareDialog from "@/components/lookup/person/ShareDialog";

// Helpers
import { cn } from "@/utils/helpers/className";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student, Teacher } from "@/utils/types/person";

const PersonHeader: FC<{ person?: Student | Teacher }> = ({ person }) => {
  const locale = useLocale();

  const [shareOpen, setShareOpen] = useState<boolean>(false);

  /**
   * The Class relevant to the selected Person.
   */
  const classItem =
    person?.role === "student"
      ? person.class
      : person?.role === "teacher" && person.classAdvisorAt
      ? person.classAdvisorAt
      : null;

  return (
    <>
      <div className="sticky flex flex-col gap-6 bg-surface-2 px-5 py-4 md:flex-row">
        <DynamicAvatar
          className={cn([
            "!h-14 !w-14",
            person?.role === "teacher" &&
              "!bg-secondary-container !text-on-secondary-container",
          ])}
        />
        <div className="flex flex-col gap-4 md:gap-2">
          <h2 className="skc-display-small break-all">
            {person ? nameJoiner(locale, person.name) : "Loading…"}
          </h2>
          <ChipSet>
            {classItem && (
              <>
                <AssistChip
                  icon={<MaterialIcon icon="groups" />}
                  href={`/lookup/class/${classItem.number}`}
                  element={Link}
                >
                  See class
                </AssistChip>
                <AssistChip
                  icon={<MaterialIcon icon="dashboard" />}
                  href={`/lookup/class/${classItem.number}/schedule`}
                  element={Link}
                >
                  See schedule
                </AssistChip>
              </>
            )}
            <AssistChip
              icon={<MaterialIcon icon="share" />}
              onClick={() => setShareOpen(true)}
            >
              Share
            </AssistChip>
          </ChipSet>
        </div>
      </div>
      {person && (
        <ShareDialog
          person={person}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
};

export default PersonHeader;
