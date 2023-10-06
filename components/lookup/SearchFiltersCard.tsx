// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Columns,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const SearchFiltersCard: StylableFC<{
  children: ReactNode;
  onSubmit: () => void;
}> = ({ children, onSubmit, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      layout="size"
      layoutId="search-filters"
      transition={transition(duration.long2, easing.emphasized)}
      style={{ ...style, borderRadius: 12 }}
      className={cn(`skc-card skc-card--outlined mx-4 sm:mx-0`, className)}
    >
      <motion.h2
        layout="position"
        transition={transition(duration.long2, easing.emphasized)}
        className="skc-text skc-text--title-medium px-4 pb-2 pt-3"
      >
        Search filters
      </motion.h2>
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(duration.medium4, easing.standardDecelerate)}
        className="flex flex-col gap-4 p-4 pt-0"
      >
        <div>
          <Text type="body-medium" element="p">
            Add optional filters to narrow down your search results.
          </Text>
          <Text type="body-medium" element="p">
            Just enter the fields you want to filter by—no need to enter every
            field.
          </Text>
        </div>
        <Columns columns={4} className="!gap-y-12 py-2">
          {children}
        </Columns>
        <Actions className="!mt-5">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="search" />}
            onClick={onSubmit}
          >
            Search
          </Button>
        </Actions>
      </motion.div>
    </motion.div>
  );
};

export default SearchFiltersCard;
