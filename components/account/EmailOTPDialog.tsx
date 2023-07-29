// Imports
import SnackbarContext from "@/contexts/SnackbarContext";
import { useNow } from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";
import { DialogComponent } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { differenceInSeconds } from "date-fns";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog asking for the OTP after the email was sent.
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param email The email to send the OTP to.
 *
 * @returns A Dialog.
 */
const EmailOTPDialog: DialogComponent<{
  email: string;
}> = ({ open, onClose, email }) => {
  const { t } = useTranslation("account", { keyPrefix: "dialog.emailOTP" });

  const router = useRouter();
  const { setSnackbar } = useContext(SnackbarContext);

  const [token, setOTP] = useState("");
  useEffect(() => {
    if (token.length === 6) verifyOTP();
  }, [token]);

  // Database interaction
  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  // Close the OTP Dialog after 60 seconds of being open
  // (We don’t use `setTimeout` here because those aren’t reliable for longer
  // periods of time)
  const now = useNow();
  const requestTime = useMemo(() => new Date(), [open]);
  const [isExpired, setIsExpired] = useState(false);
  useEffect(() => {
    if (open) setIsExpired(false);
  }, [open]);
  useEffect(() => {
    if (open && !isExpired && differenceInSeconds(now, requestTime) >= 60) {
      onClose();
      setSnackbar(<Snackbar>{t("snackbar.otpRequestExpired")}</Snackbar>);
      setIsExpired(true);
    }
  }, [now]);

  /**
   * Verify the OTP and log the user in.
   */
  async function verifyOTP() {
    withLoading(async () => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "magiclink",
      });

      if (error) {
        logError("handleRequestOTP", error);
        setSnackbar(<Snackbar>{t("snackbar.incorrectOTP")}</Snackbar>);
        return false;
      }

      va.track("Log in", { method: "Password" });
      onClose();
      await router.push("/learn");

      return true;
    }, toggleLoading);
  }

  return (
    <Dialog
      open={open}
      // Disable tap outside to close
      onClose={() => {}}
    >
      <DialogHeader title={t("title")} desc={t("desc", { email })} />
      <DialogContent className="mx-6">
        <TextField<string>
          appearance="outlined"
          label={t("form.otp")}
          disabled={loading}
          value={token}
          // Only allow numbers
          onChange={(value) => setOTP(value.replaceAll(/\D/g, ""))}
          inputAttr={{ autoFocus: true, minLength: 6, maxLength: 6 }}
          className="[&_input]:!font-mono [&_input]:!tracking-widest"
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default EmailOTPDialog;