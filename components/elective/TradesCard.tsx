import TradesCardHeader from "@/components/elective/TradesCardHeader";
import TradesCardSection from "@/components/elective/TradesCardSection";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import electivePermissionsAt from "@/utils/helpers/elective/electivePermissionsAt";
import { StylableFC } from "@/utils/types/common";
import { ElectiveTradeOffer } from "@/utils/types/elective";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Balancer from "react-wrap-balancer";

/**
 * A Card for creating and managing Trades of Elective Subjects. Students can
 * accept incoming Trade Requests and cancel outgoing ones.
 *
 * Trading is only available on the day exactly 2 weeks after the first school
 * day of the semester, i.e. if school starts on May 15th, trading will be
 * available only on May 29th.
 *
 * @param incomingTrades The pending Elective Trade Offers sent to the Student.
 * @param outgoingTrades The pending Elective Trade Offers made by the Student.
 */
const TradesCard: StylableFC<{
  incomingTrades: ElectiveTradeOffer[];
  outgoingTrades: ElectiveTradeOffer[];
}> = ({ incomingTrades, outgoingTrades, style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });

  const mysk = useMySKClient();
  const permissions = electivePermissionsAt();

  // Unavailable state
  if (!permissions.trade && !mysk.user?.is_admin)
    return (
      <section
        style={style}
        className={cn(`grid place-content-center`, className)}
      >
        <Text
          type="body-medium"
          className="max-w-md text-center text-on-surface-variant"
        >
          <Balancer>
            {t("unavailable", {
              context: permissions.choose ? "future" : "past",
            })}
          </Balancer>
        </Text>
      </section>
    );

  // Empty state
  if (incomingTrades.length === 0 && outgoingTrades.length === 0)
    return (
      <section
        style={style}
        className={cn(`space-y-3 p-4 pl-6 sm:space-y-1`, className)}
      >
        <TradesCardHeader />
        <Text
          type="body-medium"
          element="p"
          className="text-on-surface-variant"
        >
          <Balancer>{t("empty")}</Balancer>
        </Text>
      </section>
    );

  // Content state
  return (
    <section style={style} className={cn(`space-y-2 p-4 pl-6`, className)}>
      {/* Header */}
      <TradesCardHeader className="mb-0.5" />

      {/* Incoming */}
      {incomingTrades.length > 0 && (
        <TradesCardSection
          icon={
            <MaterialIcon icon="input_circle" size={20} className="rotate-90" />
          }
          title={t("incoming")}
        >
          TODO
        </TradesCardSection>
      )}

      {/* Outgoing */}
      {outgoingTrades.length > 0 && (
        <TradesCardSection
          icon={
            <MaterialIcon
              icon="output_circle"
              size={20}
              className="-rotate-90"
            />
          }
          title={t("outgoing")}
        >
          TODO
        </TradesCardSection>
      )}
    </section>
  );
};

export default TradesCard;
