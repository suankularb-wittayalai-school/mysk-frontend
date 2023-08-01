// External libraries
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC, forwardRef, useState } from "react";

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

const PersonActions: FC<{
  person?: Student | Teacher;
  suggestionsType?: "full" | "share-only";
}> = ({ person, suggestionsType }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "people.header.action" });

  // Dialog control
  const [shareOpen, setShareOpen] = useState<boolean>(false);

  /**
   * The Classroom relevant to the selected Person.
   */
  const classroom =
    person?.role === "student"
      ? person.classroom
      : person?.role === "teacher" && person.class_advisor_at
      ? person.class_advisor_at
      : null;

  return (
    <>
      <ChipSet className="[&~.skc-scrim]:mx-0">
        {suggestionsType !== "share-only" && (
          <>
            {/* See class */}
            {classroom && (
              <AssistChip
                icon={<MaterialIcon icon="groups" />}
                // TODO: I forgot to pass `href`; use the `href` props as normal when that’s fixed
                // eslint-disable-next-line react/display-name
                element={forwardRef((props, ref) => (
                  <Link
                    {...props}
                    ref={ref}
                    href={`/lookup/class/${classroom.number}`}
                  />
                ))}
              >
                {t("seeClass")}
              </AssistChip>
            )}

            {/* See schedule */}
            <AssistChip
              icon={<MaterialIcon icon="dashboard" />}
              // eslint-disable-next-line react/display-name
              element={forwardRef((props, ref) => (
                <Link
                  {...props}
                  ref={ref}
                  href={
                    person?.role === "teacher"
                      ? `/lookup/person/teacher/${person.id}/schedule`
                      : person?.role === "student" && person.classroom
                      ? `/lookup/class/${person.classroom.number}/schedule`
                      : `#`
                  }
                />
              ))}
            >
              {t("seeSchedule")}
            </AssistChip>
          </>
        )}

        {/* Share */}
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
