import RequirementsDialog from "@/components/elective/RequirementsDialog";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleString from "@/utils/helpers/getLocaleString";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Button, MaterialIcon, Snackbar } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useContext, useState } from "react";

/**
 * A Button that allows the Student to choose an Elective Subject.
 *
 * @param electiveSubjectID The session code of the Elective Subject to choose.
 * @param enrolledID The session code of the Elective Subject the Student is currently enrolled in.
 * @param disabled Whether the Button is disabled.
 * @param onSucess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ChooseButton: StylableFC<{
  electiveSubject: ElectiveSubject | null;
  enrolledElective: ElectiveSubject | null;
  disabled?: boolean;
  onSucess?: () => void;
}> = ({
  electiveSubject,
  enrolledElective,
  disabled: forceDisabled,
  onSucess,
  style,
  className,
}) => {
  const { t } = useTranslation("elective", { keyPrefix: "list" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);
  const [requirementsOpen, setRequirementsOpen] = useState(false);

  const plausible = usePlausible();
  const mysk = useMySKClient();
  const refreshProps = useRefreshProps();

  const [loading, toggleLoading] = useToggle();
  const disabled =
    // Disallow choosing if forced to be disabled.
    forceDisabled ||
    // Disallow choosing if none is selected.
    !electiveSubject ||
    // Disallow choosing if already enrolled in the same Elective Subject.
    electiveSubject.id === enrolledElective?.id;

  /**
   * Choose or change enrollment to the selected Elective Subject, depending on
   * context.
   */
  async function enroll() {
    if (!electiveSubject) return false;
    const subject = getLocaleString(electiveSubject.name, "en-US");
    const { error } = await mysk.fetch(
      `/v1/subjects/electives/${electiveSubject.id}/enroll`,
      {
        // POST for choosing, PUT for changing.
        method: enrolledElective ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fetch_level: "id_only" }),
      },
    );
    if (error) {
      if (error.code === 403 || error.code === 409) {
        plausible("Attempt to Enroll in Invalid Elective", {
          props: { subject },
        });
        setSnackbar(<Snackbar>{t("snackbar.notAllowed")}</Snackbar>);
      } else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      logError("enroll", error);
      await refreshProps();
      return false;
    }
    if (enrolledElective)
      plausible("Change Elective", {
        props: {
          from: getLocaleString(enrolledElective.name, "en-US"),
          to: subject,
        },
      });
    plausible("Enroll in Elective", { props: { subject } });
    await refreshProps();
    setSnackbar(<Snackbar>{t("snackbar.enrolled")}</Snackbar>);
    onSucess?.();
    return true;
  }

  return (
    <>
      {/* Button */}
      <Button
        appearance="filled"
        icon={<MaterialIcon icon="done" />}
        onClick={async () => {
          if (disabled || loading) return;
          withLoading(
            async () => {
              if (electiveSubject.requirements.length > 0) {
                setRequirementsOpen(true);
                return false;
              } else return await enroll();
            },
            toggleLoading,
            { hasEndToggle: true },
          );
        }}
        loading={loading}
        disabled={disabled}
        style={style}
        className={className}
      >
        {t("action.choose", {
          context: !enrolledElective
            ? "initial"
            : electiveSubject?.id !== enrolledElective.id
              ? "change"
              : "chosen",
        })}
      </Button>

      {/* Requirements */}
      {electiveSubject && electiveSubject.requirements.length > 0 && (
        <RequirementsDialog
          open={requirementsOpen}
          requirements={electiveSubject.requirements}
          onClose={() => setRequirementsOpen(false)}
          onSubmit={async () => {
            setRequirementsOpen(false);
            await withLoading(enroll, toggleLoading, { hasEndToggle: true });
          }}
        />
      )}
    </>
  );
};

export default ChooseButton;
