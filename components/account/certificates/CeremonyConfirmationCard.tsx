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
import { Student } from "@/utils/types/person";
import { Button, Card, MaterialIcon, Text } from "@suankularb-components/react";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";

const CertificateCeremonyCard: StylableFC<{
  person: Student;
  enrollmentStatus: CeremonyConfirmationStatus;
}> = ({ person, enrollmentStatus }) => {
  const mysk = useMySKClient();
  const locale = useLocale();
  const refreshProps = useRefreshProps();

  const { t } = useTranslation("account/certificates/ceremonyConfirmationCard");

  async function handleConfirmation(
    confirmationStatus: CeremonyConfirmationStatus,
  ) {
    const { error } = await mysk.fetch(`/v1/certificates/rsvp`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { rsvp_status: confirmationStatus } }),
    });
    if (error) {
      return logError("updateCeremonyConfirmation", error);
    }

    refreshProps();
  }
  const confirmationStatus = enrollmentStatus;

  return (
    <Card
      appearance="filled"
      className={cn(
        `gap-2 overflow-hidden !rounded-xl !bg-primary-container p-4 md:!flex-row md:!gap-[18px]`,
      )}
    >
      {/* Icon */}
      <div className="md:p-[3px]">
        <MaterialIcon
          icon="local_activity"
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
          <Trans
            i18nKey="account/certificates/ceremonyConfirmationCard:title"
            values={{
              name: getLocaleName(locale, person, {
                middleName: false,
                lastName: false,
              }),
            }}
          />
        </Text>
        <Text type="body-medium" element="p">
          {t("desc.eventDetails")}
        </Text>
        <Text type="body-medium" element="p">
          {t("desc.ifDecline")}
        </Text>
        <Text type="body-medium" element="p">
          {t("desc.ifIneligible")}
        </Text>

        <div
          className={cn(
            `mt-2 flex flex-col items-end justify-between gap-4 self-stretch rounded-lg bg-primary p-4 md:flex-row md:items-center md:rounded-full md:p-2 md:pl-5`,
          )}
        >
          {confirmationStatus == CeremonyConfirmationStatus["pending"] ||
          confirmationStatus == null ? (
            <>
              <Text
                type="body-medium"
                element="p"
                className="w-full text-on-primary"
              >
                {t("response.pending.text")}
              </Text>
              <div className="flex items-center gap-1">
                <Button
                  appearance="filled"
                  className="!whitespace-nowrap !bg-surface !text-on-surface"
                  onClick={() =>
                    handleConfirmation(CeremonyConfirmationStatus["approved"])
                  }
                >
                  {t("response.pending.action.yes")}
                </Button>
                <Button
                  appearance="filled"
                  className="!whitespace-nowrap !bg-surface !text-on-surface"
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
                    className="w-full text-on-primary"
                  >
                    <Trans
                      i18nKey="account/certificates/ceremonyConfirmationCard:response.accept.text"
                      components={[<b key={0} />]}
                    />
                  </Text>
                  <Button
                    appearance="filled"
                    className="!whitespace-nowrap !bg-surface !text-on-surface"
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
                    className="w-full text-on-primary"
                  >
                    <Trans
                      i18nKey="account/certificates/ceremonyConfirmationCard:response.decline.text"
                      components={[<b key={0} />]}
                    />
                  </Text>
                  <Button
                    appearance="filled"
                    className="!whitespace-nowrap !bg-surface !text-on-surface"
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
