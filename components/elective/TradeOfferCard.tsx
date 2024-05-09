import TradeOfferParticipant from "@/components/elective/TradeOfferParticipant";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ElectiveTradeOffer } from "@/utils/types/elective";
import { LayoutGroup } from "framer-motion";
import { ReactNode } from "react";

const TradeOfferCard: StylableFC<{
  children: ReactNode;
  tradeOffer: ElectiveTradeOffer;
}> = ({ children, tradeOffer, style, className }) => {
  return (
    <li
      style={style}
      className={cn(
        `grid items-center gap-3 rounded-xl bg-surface-container p-3
        sm:grid-cols-[1fr,6rem,1fr] sm:rounded-full`,
        className,
      )}
    >
      <LayoutGroup id={tradeOffer.id}>
        <TradeOfferParticipant
          participant={tradeOffer.sender}
          electiveSubject={tradeOffer.sender_elective_subject}
          className="grow"
        />
        {children}
        <TradeOfferParticipant
          participant={tradeOffer.receiver}
          electiveSubject={tradeOffer.receiver_elective_subject}
          className="grow flex-row-reverse *:text-end"
        />
      </LayoutGroup>
    </li>
  );
};

export default TradeOfferCard;
