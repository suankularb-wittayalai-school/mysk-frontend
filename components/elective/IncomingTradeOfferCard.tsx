import TradeOfferCard from "@/components/elective/TradeOfferCard";
import { StylableFC } from "@/utils/types/common";
import { ElectiveTradeOffer } from "@/utils/types/elective";
import {
  Button,
  MaterialIcon,
  SegmentedButton,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

const IncomingTradeOfferCard: StylableFC<{
  tradeOffer: ElectiveTradeOffer;
}> = ({ tradeOffer, style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });

  return (
    <TradeOfferCard tradeOffer={tradeOffer} style={style} className={className}>
      <SegmentedButton alt={t("action.respond")}>
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="done" />}
          tooltip={t("action.accept")}
        />
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="close" />}
          dangerous
          tooltip={t("action.reject")}
        />
      </SegmentedButton>
    </TradeOfferCard>
  );
};

export default IncomingTradeOfferCard;
