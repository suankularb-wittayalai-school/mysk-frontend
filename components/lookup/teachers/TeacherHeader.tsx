// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
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
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

const TeacherHeader: StylableFC<{
  teacher: Teacher;
}> = ({ teacher, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "people.header" });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(`flex flex-col gap-6 p-4 md:flex-row`, className)}
    >
      <DynamicAvatar className="!h-14 !w-14" />
      <div className="flex flex-col gap-4 md:gap-2">
        <Header
          element={(props) => <h2 id="header-person-details" {...props} />}
        >
          {getLocaleName(locale, teacher, { prefix: "teacher" })}
        </Header>
        <ChipSet>
          <AssistChip icon={<MaterialIcon icon="groups" />}>
            See class
          </AssistChip>
          <AssistChip icon={<MaterialIcon icon="lock" />}>
            Request info
          </AssistChip>
          <AssistChip icon={<MaterialIcon icon="share" />}>
            Share
          </AssistChip>
        </ChipSet>
      </div>
    </motion.div>
  );
};

export default TeacherHeader;
