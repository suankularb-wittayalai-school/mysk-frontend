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
import ShareDialog from "@/components/lookup/person/ShareDialog";

// Types
import { Student, Teacher } from "@/utils/types/person";

const PersonActions: FC<{ person?: Student | Teacher }> = ({ person }) => {
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

export default PersonActions;
