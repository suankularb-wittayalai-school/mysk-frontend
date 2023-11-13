// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import { useGetVCard } from "@/utils/helpers/contact";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  Header,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * The header of a Student Details Card. Contains the Student’s name, avatar,
 * and actions.
 *
 * @param student The Student to display.
 */
const StudentHeader: StylableFC<{
  student: Student;
}> = ({ student, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "students.header" });

  const { duration, easing } = useAnimationConfig();

  const getVCard = useGetVCard();
  async function handleSaveVCard() {
    va.track("Share Person", {
      person: getLocaleName("en-US", student),
      method: "vCard",
    });
    var vCard = getVCard(student);
    window.location.href = URL.createObjectURL(vCard);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(
        `flex flex-col gap-6 p-4 md:grid md:grid-cols-[3.5rem,minmax(0,1fr)]`,
        className,
      )}
    >
      <DynamicAvatar className="!h-14 !w-14" />
      <div className="flex flex-col gap-4 md:gap-2">
        <Header
          element={(props) => <h2 id="header-person-details" {...props} />}
        >
          {getLocaleName(locale, student)}
        </Header>
        <ChipSet
          scrollable
          className="-mx-4 !overflow-auto px-4 md:ml-0 md:pl-0"
        >
          <AssistChip
            icon={<MaterialIcon icon="download" />}
            onClick={handleSaveVCard}
          >
            Save contact
          </AssistChip>
        </ChipSet>
      </div>
    </motion.div>
  );
};

export default StudentHeader;
