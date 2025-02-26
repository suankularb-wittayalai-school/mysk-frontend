import { Button, Card, MaterialIcon, Text } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { supabase } from "@/utils/supabase-client";
import updateCeremonyConfirmation from "@/utils/backend/certificate/updateCeremonyConfirmation";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import {
  CeremonyConfirmationStatus,
  StudentCertificate,
} from "@/utils/types/certificate";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import ReportIssueButton from "@/components/common/ReportIssueButton";

const CertificateCeremonyCard: StylableFC<{
  personID: string;
  certificates: StudentCertificate[];
}> = ({ personID, certificates }) => {
  const refreshProps = useRefreshProps();

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
        `relative isolate !grid grid-cols-[3.375rem,1fr] !gap-4 overflow-hidden !rounded-xl !bg-primary-container p-4`,
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
      <div className="flex flex-col items-start gap-3">
        <Text type="title-medium" element="h3">
          You’re eligible for the ceremony!
        </Text>
        <div className="flex flex-col gap-2">
          <Text type="body-medium" element="p">
            By confirming your attendance, you agree to attend a ceremony
            rehearsal on March 3, 2025. Failure to attend will result in
            disqualification from the ceremony on March 11, 2025.
          </Text>
          <Text type="body-medium" element="p">
            Students who are not eligible for the ceremony may still receive
            your certificates at the library.
          </Text>
        </div>
        <div className="flex items-center justify-between self-stretch rounded-full bg-primary p-2 pl-5">
            <>
              <Text type="body-medium" element="p" className="text-on-primary">
                Are you attending this ceremony?
              </Text>
              <div className="flex items-center gap-2">
                <Button
                  appearance="filled"
                  className="!bg-surface !text-on-surface"
                  onClick={() =>
                    handleConfirmation(CeremonyConfirmationStatus["approved"])
                  }
                >
                  Yes
                </Button>
                <Button
                  appearance="filled"
                  className="!bg-surface !text-on-surface"
                  onClick={() =>
                    handleConfirmation(CeremonyConfirmationStatus["declined"])
                  }
                >
                  No
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
                    You’ve <b>accepted</b> to attend the ceremony,
                    <span className="opacity-50"> change of plans?</span>
                  </Text>
                  <Button
                    appearance="filled"
                    className="!bg-surface !text-on-surface"
                    onClick={() =>
                      handleConfirmation(CeremonyConfirmationStatus["declined"])
                    }
                  >
                    Decline
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
                    You’ve <b>declined</b> to attend the ceremony,
                    <span className="opacity-50"> change of plans?</span>
                  </Text>
                  <Button
                    appearance="filled"
                    className="!bg-surface !text-on-surface"
                    onClick={() =>
                      handleConfirmation(CeremonyConfirmationStatus["approved"])
                    }
                  >
                    Accept
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
