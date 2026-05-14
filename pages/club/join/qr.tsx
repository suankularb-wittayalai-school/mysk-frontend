// Imports
import PreJoinLayout from "@/components/club/join/PreJoinLayout";
import cn from "@/utils/helpers/cn";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * Give information on how to use the QR code method.
 *
 * @returns A Page.
 */
const QRMethodPage: NextPage = () => {
  const { t } = useTranslation("club/join");

  const videoRef = useRef(null);
  const router = useRouter();

  // Starts the video camera feed.
  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => validateScannedPath(result.data),
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        },
      );

      qrScanner.start();

      return () => {
        qrScanner.stop();
      };
    }
  }, [videoRef]);

  // Validates the scanner QR code path.
  const [failOpen, setFailOpen] = useState(false);
  const validateScannedPath = (path: string) => {
    const regex = /^https:\/\/clubs\.mysk\.school\/join\/club/;

    if (regex.test(path)) {
      router.push(path.replace("https://clubs.mysk.school", ""));
    } else {
      setFailOpen(true);
    }
  };

  return (
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
              <p>
                <Balancer>
                  {t("qr.scanner.havingProblems")} {t("qr.otherMethods")}
                </Balancer>
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
          <Text type="body-large" element="p" className="text-center">
            {t("qr.otherMethods")}
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
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default QRMethodPage;
