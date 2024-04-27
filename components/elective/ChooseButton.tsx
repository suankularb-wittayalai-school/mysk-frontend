import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { Button, MaterialIcon, Snackbar } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * A Button that allows the Student to choose an Elective Subject.
 *
 * @param sessionCode The session code of the Elective Subject to choose.
 * @param enrolledID The session code of the Elective Subject the Student is currently enrolled in.
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 * @param onSucess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ChooseButton: StylableFC<{
  sessionCode: number | null;
  enrolledID: number | null;
  inEnrollmentPeriod?: boolean;
  onSucess?: () => void;
}> = ({
  sessionCode,
  enrolledID,
  inEnrollmentPeriod,
  onSucess,
  style,
  className,
}) => {
  const { t } = useTranslation("elective", { keyPrefix: "list" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const mysk = useMySKClient();
  const refreshProps = useRefreshProps();

  const [loading, toggleLoading] = useToggle();
  const disabled =
    // Disallow choosing if not in time window.
    !inEnrollmentPeriod ||
    // Disallow choosing if none is selected.
    !sessionCode ||
    // Disallow choosing if already enrolled in the same Elective Subject.
    sessionCode === enrolledID;

  /**
   * Choose or change to the selected Elective Subject, depending on context.
   */
  async function handleChoose() {
    if (disabled) return;
    withLoading(
      async () => {
        const { error } = await mysk.fetch(
          `/v1/subjects/electives/${sessionCode}/enroll/`,
          {
            // POST for choosing, PUT for changing.
            method: enrolledID ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fetch_level: "id_only" }),
          },
        );
        if (error) {
          if (error.code === 403 || error.code === 409) {
            va.track("Attempt to Choose Invalid Elective", { sessionCode });
            setSnackbar(<Snackbar>{t("snackbar.notAllowed")}</Snackbar>);
          } else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          logError("handleChoose", error);
        }
        if (enrolledID)
          va.track("Change Elective", { from: enrolledID, to: sessionCode });
        va.track("Choose Elective", { sessionCode });
        await refreshProps();
        onSucess?.();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <Button
      appearance="filled"
      icon={<MaterialIcon icon="done" />}
      onClick={handleChoose}
      loading={loading}
      disabled={disabled}
      style={style}
      className={className}
    >
      {t("action.choose", {
        context: !enrolledID
          ? "initial"
          : sessionCode !== enrolledID
            ? "change"
            : "chosen",
      })}
    </Button>
  );
};

export default ChooseButton;
