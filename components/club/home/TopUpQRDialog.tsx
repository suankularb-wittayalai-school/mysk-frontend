import { Student, Teacher } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@suankularb-components/react";
import { FC } from "react";
import QRCode from "react-qr-code";
import useTranslation from "next-translate/useTranslation";

const TopUpQRDialog: FC<{
  open: boolean;
  onClose: () => void;
  user: Student | Teacher;
}> = ({ open, onClose, user }) => {
  const { t } = useTranslation("club");

  return (
    <Dialog open={open} width={580} onClose={onClose}>
      <DialogHeader
        title={t("topUp.topUpDialog.title")}
        desc={t("topUp.topUpDialog.desc")}
      />
      <DialogContent className="flex flex-col items-center gap-4">
        <div className="grid w-full grid-cols-1 grid-rows-1 place-items-center">
          <div className="border-primary-border col-start-1 row-start-1 aspect-square w-3/4 rounded-lg border-2 bg-white p-2">
            <QRCode
              value={user.id}
              level="Q"
              bgColor="transparent"
              fgColor="var(--teitiary)"
              className="aspect-square h-min w-full select-none"
            />
          </div>
          {/* <Image
            src="/images/orgs/skiso-dark.svg"
            width={128}
            height={128}
            alt=""
            className="border-primary-border col-start-1 row-start-1 h-12 w-12"
          /> */}
          {/* <Image
          src="/rings-primary.svg"
          width={512}
          height={512}
          alt=""
          className="object-fit h-full select-none"
        /> */}
        </div>
      </DialogContent>
      <Actions align="right">
        <Button appearance="text" onClick={onClose}>
          {t("topUp.topUpDialog.action.close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default TopUpQRDialog;
