import cn from "@/utils/helpers/cn";
import { CheerPracticeSession } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  ListItem,
  ListItemContent,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const CheerPeriodListItem: StylableFC<{
  cheerSession: CheerPracticeSession;
  onSessionSelect: (id: string) => void;
}> = ({ cheerSession, onSessionSelect }) => {
  const { t } = useTranslation("attendance/cheer/list");
  return (
    <motion.li
      layoutId={cheerSession.id}
      transition={transition(DURATION.medium2, EASING.standard)}
    >
      <motion.ul layout="position" className={cn(`grid w-full`)}>
        <ListItem
          align="center"
          lines={2}
          element="div"
          className="!items-center !overflow-hidden rounded-lg !px-4 !py-4"
          onClick={() => onSessionSelect(cheerSession.id)}
        >
          <ListItemContent
            title={
              cheerSession.duration != 1
                ? t("period.multiple", {
                    start: cheerSession.start_time,
                    end: cheerSession.start_time + cheerSession.duration - 1,
                  })
                : t("period.single", { start: cheerSession.start_time })
            }
            desc={t("date", { date: new Date(cheerSession.date) })}
            className="w-0 [&>span]:!truncate px-4"
          />
        </ListItem>
      </motion.ul>
    </motion.li>
  );
};

export default CheerPeriodListItem;
