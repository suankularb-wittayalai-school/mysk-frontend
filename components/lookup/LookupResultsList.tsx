import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

/**
 * The wrapper for the results list; the last child of Lookup List Side.
 *
 * @param children The results list.
 * @param length The length of the results, used in determining whether to show the empty state.
 * @param filtersURL The URL of the parent page, used in the empty state.
 */
const LookupResultsList: StylableFC<{
  children: ReactNode;
  filtersURL?: string;
  length: number;
}> = ({ children, filtersURL, length, style, className }) => {
  const { t } = useTranslation("search/common");

  return length > 0 ? (
    // List
    <div
      style={style}
      className={cn(
        `-mx-4 sm:mx-0 sm:-mr-3 md:grow md:overflow-auto`,
        className,
      )}
    >
      <ul className="flex flex-col gap-1 pb-6 pt-4 sm:pr-3">{children}</ul>
    </div>
  ) : (
    // Empty state
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...transition(DURATION.medium2, EASING.standardDecelerate),
        delay: DURATION.medium2,
      }}
      className={cn(`skc-card skc-card--outlined mt-4 flex grow flex-col
        items-center justify-center gap-1 p-4 sm:mb-6`)}
    >
      <Text
        type="body-medium"
        element="p"
        className="text-center text-on-surface-variant"
      >
        <Balancer>{t("empty.desc")}</Balancer>
      </Text>
      {filtersURL && (
        <Button appearance="text" href={filtersURL} element={Link}>
          {t("empty.action.clear")}
        </Button>
      )}
    </motion.div>
  );
};

export default LookupResultsList;
