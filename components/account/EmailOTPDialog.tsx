// Imports
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";
import { DialogComponent } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EmailOTPDialog: DialogComponent<{
  email: string;
}> = ({ open, onClose, email }) => {
  const router = useRouter();

  const [token, setOTP] = useState("");
  useEffect(() => {
    if (token.length === 6) verifyOTP();
  }, [token]);

  // Database interaction
  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  async function verifyOTP() {
    withLoading(async () => {
      const {
        data: { session },
      } = await supabase.auth.verifyOtp({ email, token, type: "magiclink" });

      if (!session) return false;

      va.track("Log in", { method: "Password" });
      onClose();
      await router.push("/learn");

      return true;
    }, toggleLoading);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title="OTP sent to your email"
        desc={`We’ve sent a 6-digit one-time password to ${email}. Enter the code to log in.`}
      />
      <DialogContent className="mx-6">
        <TextField<string>
          appearance="outlined"
          label="6-digit OTP"
          disabled={loading}
          value={token}
          onChange={setOTP}
          inputAttr={{ minLength: 6, maxLength: 6 }}
          className="[&_input]:!font-mono [&_input]:!tracking-widest"
        />
      </DialogContent>
      <Actions>
        <Button appearance="text">Cancel</Button>
      </Actions>
    </Dialog>
  );
};

export default EmailOTPDialog;
