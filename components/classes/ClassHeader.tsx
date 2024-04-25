import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import useConvertContactsForVCard from "@/utils/helpers/contact/useConvertContactsForVCard";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { title } from "radash";

/**
 * The header of a Class Details Card, including the class number, actions for
 * the user’s role, and Attendance Dialog.
 *
 * @param classroom The Classroom to display.
 */
const ClassHeader: StylableFC<{
  classroom: Omit<Classroom, "students" | "year" | "subjects">;
}> = ({ classroom, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "header" });
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();
  const convertContactsForVCard = useConvertContactsForVCard();

  const isOwnClass =
    mysk.person && classroomOfPerson(mysk.person)?.id === classroom?.id;
  const canSeeSensitive =
    isOwnClass ||
    (mysk.user &&
      (mysk.user.is_admin || mysk.user.role !== UserRole.student)) ||
    false;

  /**
   * Save the Classroom Contacts as a vCard file.
   */
  function handleSaveVCard() {
    va.track("Save Class Contact", {
      number: `M.${classroom.number}`,
      method: "vCard",
    });
    const vCard = new Blob(
      [
        [
          // File header
          `BEGIN:VCARD`,
          `VERSION:3.0`,

          // Name
          `N:${tx("class", { number: classroom.number })}`,

          // Contacts
          convertContactsForVCard(classroom.contacts),

          // VCard metadata
          `KIND:group`,
          `REV:${new Date().toISOString()}`,

          // File footer
          `END:VCARD`,
        ].join("\n"),
      ],
      { type: "text/vcard;charset=utf-8" },
    );
    window.location.href = URL.createObjectURL(vCard);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(DURATION.medium2, EASING.standard)}
      style={style}
      className={cn(`grid gap-2 p-4`, className)}
    >
      <Text type="headline-medium" element="h2">
        {tx("class", { number: classroom.number })}
        <span className="text-on-surface-variant">
          {" • "}
          {classroom.main_room}
        </span>
      </Text>
      <ChipSet scrollable className="-mx-6 px-6">
        {canSeeSensitive && (
          <>
            {/* Student List Printout */}
            <AssistChip
              icon={<MaterialIcon icon="print" />}
              onClick={() =>
                va.track("Get Student List Printout", {
                  number: `M.${classroom.number}`,
                })
              }
              href={`/classes/${classroom.number}/print`}
              element={Link}
            >
              {t("action.print")}
            </AssistChip>

            {/* Attendance */}
            <AssistChip
              icon={<MaterialIcon icon="assignment_turned_in" />}
              onClick={() =>
                va.track("View Attendance", {
                  location: "Home Glance",
                  role: title(mysk.user!.role),
                  number: `M.${classroom.number}`,
                  isOwnClass,
                })
              }
              href={`/classes/${classroom.number}/attendance`}
              element={Link}
            >
              {t(
                `action.attendance.${
                  mysk.user!.role === UserRole.teacher ? "edit" : "view"
                }`,
              )}
            </AssistChip>
          </>
        )}

        {/* Contacts */}
        <AssistChip
          icon={<MaterialIcon icon="download" />}
          onClick={handleSaveVCard}
        >
          {t("action.saveContact")}
        </AssistChip>
      </ChipSet>
    </motion.div>
  );
};

export default ClassHeader;
