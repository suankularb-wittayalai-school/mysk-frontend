// Imports
import cn from "@/utils/helpers/cn";
import useConvertContactsForVCard from "@/utils/helpers/contact/useConvertContactsForVCard";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
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

/**
 * The header of a Class Details Card, including the class number, actions for
 * the user’s role, and Attendance Dialog.
 *
 * @param classroom The Classroom to display.
 * @param isOwnClass Whether the user owns the class.
 * @param role The role of the currently logged in user.
 */
const ClassHeader: StylableFC<{
  classroom: Omit<Classroom, "students" | "year" | "subjects">;
  isOwnClass?: boolean;
  role: UserRole;
}> = ({ classroom, isOwnClass, role, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "header" });
  const { t: tx } = useTranslation("common");

  const convertContactsForVCard = useConvertContactsForVCard();

  const { duration, easing } = useAnimationConfig();

  /**
   * Save the Classroom Contacts as a vCard file.
   */
  function handleSaveVCard() {
    va.track("Save Class Contact", {
      person: `M.${classroom.number}`,
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
      </Text>
      <ChipSet scrollable className="-mx-6 px-6">
        {(role !== "student" || isOwnClass) && (
          <AssistChip
            icon={<MaterialIcon icon="print" />}
            href={`/classes/print/${classroom.number}`}
            element={Link}
          >
            {t("action.print")}
          </AssistChip>
        )}
        <AssistChip
          icon={<MaterialIcon icon="download" />}
          onClick={handleSaveVCard}
        >
          {t("action.saveContact")}
        </AssistChip>
        {/* <AssistChip icon={<MaterialIcon icon="lock" />}>
          {t("action.requestInfo")}
        </AssistChip> */}
      </ChipSet>
    </motion.div>
  );
};

export default ClassHeader;
