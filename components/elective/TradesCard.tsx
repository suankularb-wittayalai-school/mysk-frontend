import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Balancer from "react-wrap-balancer";

/**
 * A Card for creating and managing Trades of Elective Subjects. Students can
 * accept incoming Trade Requests and cancel outgoing ones.
 *
 * Trading is only available on the day exactly 2 weeks after the first school
 * day of the semester, i.e. if school starts on May 15th, trading will be
 * available only on May 29th.
 */
const TradesCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });

  return (
    <section
      style={style}
      className={cn(`grid place-content-center`, className)}
    >
      <Text
        type="body-medium"
        className="max-w-md text-center text-on-surface-variant"
      >
        <Balancer>{t("unavailable", { context: "future" })}</Balancer>
      </Text>
    </section>
  );
};

export default TradesCard;
