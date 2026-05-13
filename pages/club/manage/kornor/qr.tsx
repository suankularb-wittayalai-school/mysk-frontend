// Imports
import PreJoinLayout from "@/components/club/join/PreJoinLayout";
import TopUpDialog from "@/components/club/manage/kornor/TopUpDialog";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import cn from "@/utils/helpers/cn";
import { LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Text,
  MaterialIcon,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const KornorTopUpQRPage: NextPage = () => {
  const { t } = useTranslation("club/manage/kornor");
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [scannedUser, setScannedUser] = useState<Student>();

  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const videoRef = useRef(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  // Starts the video camera feed.
  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => validateScannedid(result.data),
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        },
      );
      qrScannerRef.current = qrScanner;
      qrScanner.start();

      return () => {
        qrScanner.stop();
      };
    }
  }, [videoRef]);

  // Validates the scanner QR code path.
  const [failOpen, setFailOpen] = useState(false);
  const validateScannedid = async (id: string) => {
    const regex =
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

    if (regex.test(id)) {
      const { data: newUser, error } = await getStudentByID(supabase, mysk, id);
      if (error || newUser == null) {
        setFailOpen(true);
      } else {
        setScannedUser(newUser);
        setTopUpDialogOpen(true);
      }
    } else {
      setFailOpen(true);
    }
  };

  useEffect(() => {
    if (qrScannerRef.current) {
      if (topUpDialogOpen || failOpen) {
        qrScannerRef.current.pause();
      } else {
        qrScannerRef.current.start();
      }
    }
  }, [topUpDialogOpen, failOpen]);

  return (
    <>
      <PreJoinLayout tabName={t("qr.tabName")}>
        <div
          className={cn(
            `flex h-full flex-col items-center justify-center gap-3 text-center`,
          )}
        >
          <div
            className={cn(
              `relative aspect-square w-full overflow-hidden rounded-lg bg-primary-container [&>.scan-region-highlight>*]:!stroke-primary`,
            )}
          >
            <video
              ref={videoRef}
              className="absolute left-0 top-0 h-full w-full object-cover"
            />
            <div className="grid aspect-square w-full place-items-center">
              <div
                className={cn(
                  `flex flex-col gap-3 p-4 [&>p]:text-on-primary-container`,
                )}
              >
                <p>
                  <Balancer>{t("qr.scanner.permission")}</Balancer>
                </p>
              </div>
            </div>
          </div>
          <div
            className={cn(
              `my-4 flex flex-grow flex-col items-center justify-center gap-3 text-center`,
            )}
          >
            <MaterialIcon
              icon="qr_code_scanner"
              size={48}
              className="h-max text-primary"
            />
            <Text type="headline-medium" element="h1" className="text-center">
              {t("qr.title")}
            </Text>
            <Text type="body-large" element="p" className="text-center">
              {t("qr.desc")}
            </Text>
          </div>
        </div>
        <Actions align="full">
          <Button appearance="outlined" href="/club" element={Link}>
            {t("qr.supportDialog.action.close")}
          </Button>
        </Actions>
        <Dialog open={failOpen} onClose={() => setFailOpen(false)}>
          <DialogHeader desc={t("qr.supportDialog.desc")} />
          <DialogContent className="mx-6">
            <p className="skc-body-medium text-on-surface-variant">
              {t("qr.supportDialog.tryAgain")}
            </p>
          </DialogContent>
          <Actions>
            <Button appearance="text" onClick={() => setFailOpen(false)}>
              {t("qr.supportDialog.action.close")}
            </Button>
          </Actions>
        </Dialog>
      </PreJoinLayout>
      {scannedUser && (
        <TopUpDialog
          open={topUpDialogOpen}
          onClose={() => {
            setTopUpDialogOpen(false);
          }}
          user={scannedUser}
        />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "join"]),
});

export default KornorTopUpQRPage;
