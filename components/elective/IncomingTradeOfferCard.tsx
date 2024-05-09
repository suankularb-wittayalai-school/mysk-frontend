import TradeOfferCard from "@/components/elective/TradeOfferCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject, ElectiveTradeOffer } from "@/utils/types/elective";
import {
  Button,
  MaterialIcon,
  SegmentedButton,
  Snackbar,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useContext } from "react";

/**
 * A Card that displays an incoming Trade Offer.
 *
 * @param tradeOffer The Trade Offer to display.
 */
const IncomingTradeOfferCard: StylableFC<{
  tradeOffer: ElectiveTradeOffer;
}> = ({ tradeOffer, style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });
  const { t: tx } = useTranslation("common");

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
   * Visually swaps the Elective Subjects of the Trade Offer. Does not affect
   * the database.
   */
  async function visuallySwapElectiveSubjects() {
    const senderSubject = tradeOffer.sender_elective_subject;
    tradeOffer.sender_elective_subject = tradeOffer.receiver_elective_subject;
    tradeOffer.receiver_elective_subject = senderSubject;
  }

  /**
   * Saves the new status to the database.
   * @param status The status to update the Trade Offer to.
   * @returns Boolean of success.
   */
  async function updateStatus(
    status: Exclude<ElectiveTradeOffer["status"], "pending">,
  ) {
    const { error } = await mysk.fetch(
      `/v1/subjects/electives/trade-offers/${tradeOffer.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fetch_level: "id_only", data: { status } }),
      },
    );
    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      logError("updateStatus", error);
      visuallySwapElectiveSubjects();
      return false;
    }
    plausible(
      status === "approved"
        ? "Approve Incoming Elective Trade Offer"
        : "Decline Incoming Elective Trade Offer",
      {
        props: {
          sending: getName(tradeOffer.sender_elective_subject),
          receiving: getName(tradeOffer.receiver_elective_subject),
        },
      },
    );
    await refreshProps();
    setSnackbar(<Snackbar>{t(`snackbar.${status}`)}</Snackbar>);
    return true;
  }

  /**
   * Accepts or rejects the incoming Trade Offer.
   * @param status The status to update the Trade Offer to.
   */
  async function handleStatusUpdate(
    status: Exclude<ElectiveTradeOffer["status"], "pending">,
  ) {
    // Visually swap Elective Subjects.
    if (status === "approved") visuallySwapElectiveSubjects();

    // Update the Trade Offer status.
    withLoading(async () => updateStatus(status), toggleLoading, {
      hasEndToggle: true,
    });
  }

  return (
    <TradeOfferCard
      tradeOffer={tradeOffer}
      style={style}
      className={cn(loading && `animate-pulse`, className)}
    >
      {!loading ? (
        <SegmentedButton alt={t("action.respond")} density={-1} full>
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="done" />}
            tooltip={t("action.accept")}
            onClick={() => handleStatusUpdate("approved")}
          />
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="close" />}
            dangerous
            tooltip={t("action.decline")}
            onClick={() => handleStatusUpdate("declined")}
          />
        </SegmentedButton>
      ) : (
        <div />
      )}
    </TradeOfferCard>
  );
};

export default IncomingTradeOfferCard;
