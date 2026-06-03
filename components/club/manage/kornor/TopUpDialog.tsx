import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleName from "@/utils/helpers/getLocaleName";
import logError from "@/utils/helpers/logError";
import useLocale from "@/utils/helpers/useLocale";
import { Student } from "@/utils/types/person";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { pick } from "radash";
import { FC, useContext, useState } from "react";

const TopUpDialog: FC<{
  open: boolean;
  onClose: () => void;
  user: Student;
}> = ({ open, onClose, user }) => {
  const mysk = useMySKClient();
  const { setSnackbar } = useContext(SnackbarContext);

  const locale = useLocale();
  const { t } = useTranslation("club/manage/kornor");
  const { t: tx } = useTranslation("common");

  const [topUpValue, setTopUpValue] = useState<number | null>(0);

  const handleTopUp = async () => {
    const { data: maxClubQuotas } = await mysk.fetch<number>(
      `/v1/students/${user?.id}/clubs/quota`,
    );

    const quota = (maxClubQuotas ?? 0) + (topUpValue ?? 0);
    const { error } = await mysk.fetch(`/v1/students/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          club_quota: quota,
        },
      }),
    });

    if (!error) {
      setSnackbar(<Snackbar>{t("qr.snackbar.success")}</Snackbar>);
      onClose();
    }

    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      logError("Update Club Quota", error);
      return false;
    }
    setTopUpValue(null);
  };

  return (
    <Dialog open={open} width={580} onClose={onClose}>
      <DialogHeader
        title={t("topUpDialog.title")}
        desc={
          <Trans
            i18nKey="club/manage/kornor:topUpDialog.description"
            values={{
              name: getLocaleName(
                locale,
                pick(user, ["first_name", "last_name"]),
              ),
            }}
            components={[
              <u key="underline" style={{ textDecoration: "underline" }} />,
            ]}
          />
        }
      />
      <DialogContent className="mx-6 mb-6 flex flex-col gap-6">
        <TextField
          appearance="filled"
          value={topUpValue ? topUpValue.toString() : ""}
          trailing={t("topUpDialog.amount.unit")}
          onChange={(value) => {
            setTopUpValue(value !== null ? Number(value) : null);
          }}
          label={t("topUpDialog.amount.title")}
          inputAttr={{ type: "number" }}
        />
        <div className="flex flex-col gap-2">
          <Button
            appearance="filled"
            disabled={topUpValue !== null && topUpValue <= 0}
            onClick={handleTopUp}
          >
            {t("topUpDialog.action.topUp")}
          </Button>
          <Button appearance="outlined" onClick={onClose}>
            {t("topUpDialog.action.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;
