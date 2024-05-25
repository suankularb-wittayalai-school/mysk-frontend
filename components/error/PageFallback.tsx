import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ReportIssueButton from "@/components/common/ReportIssueButton";
import CallStackSection from "@/components/error/CallStackSection";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import SnackbarContext from "@/contexts/SnackbarContext";
import ClientErrorDark from "@/public/images/graphics/error/client-dark.png";
import ClientErrorLight from "@/public/images/graphics/error/client-light.png";
import {
  Actions,
  Button,
  MaterialIcon,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

const PageFallback: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ClientErrorLight}
            srcDark={ClientErrorDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title={t("error.client.title")}
        verbose={t("error.client.verbose")}
        tabName={t("error.client.tabName")}
      >
        <Text type="body-large" element="div" className="space-y-2">
          <p>{t("error.client.desc")}</p>
          <p>{t("error.common.persistNotice")}</p>
        </Text>
        <Actions align="left">
          <ReportIssueButton location="Client-side Error Fallback" />
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="content_copy" />}
            onClick={() => {
              navigator.clipboard.writeText(error.stack || error.message);
              setSnackbar(
                <Snackbar>{t("snackbar.copiedToClipboard")}</Snackbar>,
              );
            }}
          >
            {t("error.client.action.copyToClipboard")}
          </Button>
        </Actions>
      </ErrorHero>
      <CallStackSection error={error} />
    </ErrorLayout>
  );
};

export default PageFallback;
