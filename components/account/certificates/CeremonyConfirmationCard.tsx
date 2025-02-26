import updateCeremonyConfirmation from "@/utils/backend/certificate/updateCeremonyConfirmation";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { supabase } from "@/utils/supabase-client";
import {
  CeremonyConfirmationStatus,
  StudentCertificate,
} from "@/utils/types/certificate";
import { StylableFC } from "@/utils/types/common";
import { Button, Card, MaterialIcon, Text } from "@suankularb-components/react";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

const CertificateCeremonyCard: StylableFC<{
  personID: string;
  certificates: StudentCertificate[];
}> = ({ personID, certificates }) => {
  const refreshProps = useRefreshProps();
  const { t } = useTranslation("account/certificates/ceremonyConfirmationCard");

  async function handleConfirmation(
    confirmationStatus: CeremonyConfirmationStatus,
  ) {
    await updateCeremonyConfirmation(
      supabase,
      personID,
      currentAcademicYear,
      confirmationStatus,
    );
    refreshProps();
  }
  const currentAcademicYear = getCurrentAcademicYear();
  const confirmationStatus = certificates[0].rsvp_status;

  return (
    <Card
      appearance="filled"
      className={cn(
        `relative isolate !grid grid-cols-[3.375rem,1fr] !gap-4 overflow-hidden 
        !rounded-xl !bg-primary-container p-4`,
      )}
    >
      {/* Icon */}
      <div className="relative aspect-square px-[3px]">
        <MaterialIcon
          icon="mark_email_unread"
          size={48}
          className="text-primary"
        />
      </div>

      {/* Text */}
      <div
        className={cn(
          `flex flex-col items-start gap-3 [&>*]:text-on-primary-container`,
        )}
      >
        <Text type="title-medium" element="h3">
          {t("title")}
        </Text>
        <div className="flex flex-col gap-2">
          <Text type="body-medium" element="p">
            {t("desc.eventDetails")}
          </Text>
          <Text type="body-medium" element="p">
            {t("desc.ifIneligible")}
          </Text>
        </div>
        <div
          className={cn(
            `flex items-center justify-between self-stretch rounded-full 
            bg-primary p-2 pl-5`,
          )}
        >
          {confirmationStatus == CeremonyConfirmationStatus["pending"] ||
          confirmationStatus == null ? (
            <>
              <Text type="body-medium" element="p" className="text-on-primary">
                {t("response.pending.text")}
              </Text>
              <div className="flex items-center gap-2">
                <Button
                  appearance="filled"
                  className="!bg-surface !text-on-surface"
                  onClick={() =>
                    handleConfirmation(CeremonyConfirmationStatus["approved"])
                  }
                >
                  {t("response.pending.action.yes")}
                </Button>
                <Button
                  appearance="filled"
                  className="!bg-surface !text-on-surface"
                  onClick={() =>
                    handleConfirmation(CeremonyConfirmationStatus["declined"])
                  }
                >
                  {t("response.pending.action.no")}
                </Button>
              </div>
            </>
          ) : (
            <>
              {confirmationStatus == CeremonyConfirmationStatus["approved"] && (
                <>
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-on-primary"
                  >
                    <Trans
                      i18nKey="account/certificates/ceremonyConfirmationCard:response.accept.text"
                      components={[<b />, <span className="opacity-50" />]}
                    />
                  </Text>
                  <Button
                    appearance="filled"
                    className="!bg-surface !text-on-surface"
                    onClick={() =>
                      handleConfirmation(CeremonyConfirmationStatus["declined"])
                    }
                  >
                    {t("response.accept.action.change")}
                  </Button>
                </>
              )}
              {confirmationStatus == CeremonyConfirmationStatus["declined"] && (
                <>
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-on-primary"
                  >
                    <Trans
                      i18nKey="account/certificates/ceremonyConfirmationCard:response.decline.text"
                      components={[
                        <b key={0} />,
                        <span className="opacity-50" key={1} />,
                      ]}
                    />
                  </Text>
                  <Button
                    appearance="filled"
                    className="!bg-surface !text-on-surface"
                    onClick={() =>
                      handleConfirmation(CeremonyConfirmationStatus["approved"])
                    }
                  >
                    {t("response.decline.action.change")}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CertificateCeremonyCard;
