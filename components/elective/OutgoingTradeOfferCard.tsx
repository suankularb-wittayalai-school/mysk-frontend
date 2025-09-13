import TradeOfferCard from "@/components/elective/TradeOfferCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject, ElectiveTradeOffer } from "@/utils/types/elective";
import { Actions, Button, Snackbar } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import logError from "@/utils/helpers/logError";
import { usePlausible } from "next-plausible";
import getLocaleString from "@/utils/helpers/getLocaleString";

/**
 * A Card that displays an outgoing Trade Offer.
 *
 * @param tradeOffer The outgoing Trade Offer to display.
 */
const OutgoingTradeOfferCard: StylableFC<{
  tradeOffer: ElectiveTradeOffer;
}> = ({ tradeOffer, style, className }) => {
  const { t } = useTranslation("elective/detail/trade");

  const plausible = usePlausible();
  const refreshProps = useRefreshProps();
  const { setSnackbar } = useContext(SnackbarContext);
  const mysk = useMySKClient();

  const [loading, toggleLoading] = useToggle();

  /** Format an Elective Subject for analytics. */
  function getName(electiveSubject: ElectiveSubject) {
    return getLocaleString(electiveSubject.name, "en-US");
  }

  /**
   * Cancels the outgoing Trade Offer.
   *
   * @returns Boolean of success.
   */
  async function handleCancel() {
    const { error } = await mysk.fetch(
      `/v1/subjects/electives/trade-offers/${tradeOffer.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fetch_level: "id_only",
          data: { status: "declined" },
        }),
      },
    );
    if (error) {
      setSnackbar(<Snackbar>{t("common:snackbar.failure")}</Snackbar>);
      logError("handleCancel", error);
      return false;
    }
    plausible("Cancel Outgoing Elective Trade Offer", {
      props: {
        sending: getName(tradeOffer.sender_elective_subject),
        receiving: getName(tradeOffer.receiver_elective_subject),
      },
    });
    await refreshProps();
    setSnackbar(<Snackbar>{t("snackbar.cancelled")}</Snackbar>);
    return true;
  }

  return (
    <TradeOfferCard
      tradeOffer={tradeOffer}
      style={style}
      className={cn(loading && `animate-pulse`, className)}
    >
      <Actions align="center">
        <Button
          appearance="outlined"
          dangerous
          disabled={loading}
          onClick={() =>
            withLoading(handleCancel, toggleLoading, { hasEndToggle: true })
          }
        >
          {t("action.cancel")}
        </Button>
      </Actions>
    </TradeOfferCard>
  );
};

export default OutgoingTradeOfferCard;
