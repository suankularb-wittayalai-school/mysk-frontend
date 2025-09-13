import IncomingTradeOfferCard from "@/components/elective/IncomingTradeOfferCard";
import OutgoingTradeOfferCard from "@/components/elective/OutgoingTradeOfferCard";
import TradesCardHeader from "@/components/elective/TradesCardHeader";
import TradesCardSection from "@/components/elective/TradesCardSection";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ElectiveTradeOffer } from "@/utils/types/elective";
import { MaterialIcon, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Balancer from "react-wrap-balancer";

/**
 * A Card for creating and managing Trades of Elective Subjects. Students can
 * accept incoming Trade Requests and cancel outgoing ones.
 *
 * @param incomingTrades The pending Elective Trade Offers sent to the Student.
 * @param outgoingTrades The pending Elective Trade Offers made by the Student.
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 */
const ManageTradesCard: StylableFC<{
  incomingTrades: ElectiveTradeOffer[];
  outgoingTrades: ElectiveTradeOffer[];
  inEnrollmentPeriod?: boolean;
}> = ({
  incomingTrades,
  outgoingTrades,
  inEnrollmentPeriod,
  style,
  className,
}) => {
  const { t } = useTranslation("elective/detail/trade");

  // Unavailable state
  if (!inEnrollmentPeriod)
    return (
      <section
        style={style}
        className={cn(`grid place-content-center`, className)}
      >
        <Text
          type="body-medium"
          className="max-w-md text-center text-on-surface-variant"
        >
          <Balancer>{t("unavailable")}</Balancer>
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
          {incomingTrades.map((tradeOffer) => (
            <IncomingTradeOfferCard
              key={tradeOffer.id}
              tradeOffer={tradeOffer}
            />
          ))}
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
          {outgoingTrades.map((tradeOffer) => (
            <OutgoingTradeOfferCard
              key={tradeOffer.id}
              tradeOffer={tradeOffer}
            />
          ))}
        </TradesCardSection>
      )}
    </section>
  );
};

export default ManageTradesCard;
