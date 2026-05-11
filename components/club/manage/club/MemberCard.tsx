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
import { useTranslation } from "next-i18next";
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
  const { t: tx } = useTranslation("common");

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
            getLocaleString(member.first_name, locale),
            getLocaleString(member.last_name, locale),
          ].join(" ")}
          subtitle={
            member.classroom
              ? tx("class", { number: member.classroom.number, ns: "common" })
              : undefined
          }
          className="[font-feature-settings:'tnum'on,'lnum'on]"
        />
      </Card>
    </motion.li>
  );
};

export default MemberCard;
