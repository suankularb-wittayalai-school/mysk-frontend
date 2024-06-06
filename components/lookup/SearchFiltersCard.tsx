import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Columns,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { ReactNode } from "react";

const SearchFiltersCard: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  title: string;
  onSubmit: () => void;
}> = ({ children, icon, title, onSubmit, style, className }) => {
  const { t } = useTranslation("search/landing");

  return (
    <motion.div
      layout="size"
      layoutId="search-filters"
      transition={transition(DURATION.long2, EASING.emphasized)}
      style={{ ...style, borderRadius: 12 }}
      className={cn(`skc-card skc-card--outlined mx-4 sm:mx-0`, className)}
    >
      <motion.div
        layout="position"
        transition={transition(DURATION.long2, EASING.emphasized)}
        className="flex flex-row items-center gap-4 px-4 py-3"
      >
        <div className="text-on-surface-variant">{icon}</div>
        <Text type="title-medium" element="h2">
          {title}
        </Text>
      </motion.div>
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(DURATION.medium4, EASING.standardDecelerate)}
        className="flex flex-col gap-4 p-4 pt-0"
      >
        <Text type="body-medium" element="p">
          <Trans
            i18nKey="search/landing:filters.desc"
            components={{ br: <br /> }}
          />
        </Text>
        <Columns columns={4} className="!gap-y-12 py-2">
          {children}
        </Columns>
        <Actions className="!mt-5">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="search" />}
            onClick={onSubmit}
          >
            {t("filters.action.search")}
          </Button>
        </Actions>
      </motion.div>
    </motion.div>
  );
};

export default SearchFiltersCard;
