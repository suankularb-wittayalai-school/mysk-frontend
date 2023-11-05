// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import { useGetVCard } from "@/utils/helpers/contact";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
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
 * The header of a Teacher Details Card. Contains the Teacher’s name, avatar,
 * and actions.
 * 
 * @param teacher The Teacher to display.
 * @param onScheduleOpenClick Callback to open the Teacher’s schedule.
 */
const TeacherHeader: StylableFC<{
  teacher: Teacher;
  onScheduleOpenClick: () => void;
}> = ({ teacher, onScheduleOpenClick, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers.header" });

  const { duration, easing } = useAnimationConfig();

  const getVCard = useGetVCard();
  async function handleSaveVCard() {
    va.track("Share Person", {
      person: getLocaleName("en-US", teacher),
      method: "vCard",
    });
    var vCard = getVCard(teacher);
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
          {getLocaleName(locale, teacher, { prefix: "teacher" })}
        </Header>
        <ChipSet
          scrollable
          className="-mx-4 !overflow-auto px-4 md:ml-0 md:pl-0"
        >
          <AssistChip
            icon={<MaterialIcon icon="download" />}
            onClick={handleSaveVCard}
          >
            {t("action.saveContact")}
          </AssistChip>
          {teacher.class_advisor_at && (
            <AssistChip icon={<MaterialIcon icon="groups" />}>
              {t("action.seeClass")}
            </AssistChip>
          )}
          <AssistChip
            icon={<MaterialIcon icon="dashboard" />}
            onClick={() => {
              va.track("See Schedule of Person", {
                person: getLocaleName("en-US", teacher),
              });
              onScheduleOpenClick();
            }}
          >
            {t("action.seeSchedule")}
          </AssistChip>
        </ChipSet>
      </div>
    </motion.div>
  );
};

export default TeacherHeader;
