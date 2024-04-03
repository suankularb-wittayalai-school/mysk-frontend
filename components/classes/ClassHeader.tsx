// Imports
import cn from "@/utils/helpers/cn";
import useConvertContactsForVCard from "@/utils/helpers/contact/useConvertContactsForVCard";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
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
 * @param isOwnClass Whether the user owns the class.
 * @param user The currently logged in user. Used for Role and Permissions.
 */
const ClassHeader: StylableFC<{
  classroom: Omit<Classroom, "students" | "year" | "subjects">;
  isOwnClass?: boolean;
  user: User;
}> = ({ classroom, isOwnClass, user, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "header" });
  const { t: tx } = useTranslation("common");

  const convertContactsForVCard = useConvertContactsForVCard();

  const { duration, easing } = useAnimationConfig();

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
      transition={transition(duration.medium2, easing.standard)}
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
        {(user.is_admin || user.role !== UserRole.student || isOwnClass) && (
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
                  role: title(user.role),
                  number: `M.${classroom.number}`,
                  isOwnClass: true,
                })
              }
              href={`/classes/${classroom.number}/attendance`}
              element={Link}
            >
              {t(
                `action.attendance.${user.role === UserRole.teacher ? "edit" : "view"}`,
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
