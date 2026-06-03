// Imports
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Student } from "@/utils/types/person";
import {
  Avatar,
  Card,
  CardHeader,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

/**
 * A Card for a Club Member.
 *
 * @param member A Student instance.
 *
 * @returns A Card.
 */
const MemberCard: FC<{ member: Student }> = ({ member }) => {
  const locale = useLocale();
  const { t } = useTranslation("club/manage");

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.li
      exit={{ opacity: 0, scale: 0.2, y: 0 }}
      layoutId={String(member.id)}
      transition={transition(duration.medium2, easing.standard)}
    >
      <Card appearance="outlined">
        <CardHeader
          avatar={<Avatar />}
          title={[
            getLocaleString((member as any).person.first_name, locale),
            getLocaleString((member as any).person.last_name, locale),
          ].join(" ")}
          className="[font-feature-settings:'tnum'on,'lnum'on]"
        />
      </Card>
    </motion.li>
  );
};

export default MemberCard;
