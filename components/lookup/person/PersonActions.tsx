// External libraries
import Link from "next/link";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation("lookup", { keyPrefix: "people.header.action" });

  // Dialog control
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
              {t("seeClass")}
            </AssistChip>
            <AssistChip
              icon={<MaterialIcon icon="dashboard" />}
              href={`/lookup/class/${classItem.number}/schedule`}
              element={Link}
            >
              {t("seeSchedule")}
            </AssistChip>
          </>
        )}
        <AssistChip
          icon={<MaterialIcon icon="share" />}
          onClick={() => setShareOpen(true)}
        >
          {t("share")}
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
