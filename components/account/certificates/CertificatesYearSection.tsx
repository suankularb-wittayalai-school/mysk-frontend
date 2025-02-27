import CertificateCeremonyCard from "@/components/account/certificates/CeremonyConfirmationCard";
import CertificateCard from "@/components/account/certificates/CertificateCard";
import ReceivingOrderDialog from "@/components/account/certificates/ReceivingOrderDialog";
import SeatDialog from "@/components/account/certificates/SeatDialog";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { StudentCertificate } from "@/utils/types/certificate";
import { StylableFC } from "@/utils/types/common";
import {
  AssistChip,
  ChipSet,
  Header,
  MaterialIcon,
  Section,
  Text,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { Student } from "@/utils/types/person";

/**
 * A section that shows the user’s Student Certificates in a specific academic
 * year.
 *
 * @param year Academic year.
 * @param certificates Certificates in the academic year.
 */
const CertificatesYearSection: StylableFC<{
  year: number;
  certificates: StudentCertificate[];
  person: Student[];
  personID: string;
}> = ({ year, certificates, person, personID, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("account/certificates");
  const currentAcademicYear = getCurrentAcademicYear();

  const [orderOpen, setOrderOpen] = useState(false);
  const [seatOpen, setSeatOpen] = useState(false);

  return (
    <Section style={style} className={cn(`!gap-2`, className)}>
      {/* Academic year */}
      <Header level={3}>{String(getLocaleYear(locale, year, "AD"))}</Header>

      {/* Receiving procedure information */}
      {(() => {
        if (!certificates?.length) return null;
        const { receiving_order_number, seat_code } = certificates[0];

        // If inEnrollmentPeriod is implemented, use that instead.
        if (
          (currentAcademicYear != year &&
            process.env.NEXT_PUBLIC_CERTIFICATES_CEREMONY_ENROLLMENT_PERIOD ==
              "false") ||
          process.env.NEXT_PUBLIC_CERTIFICATES_CEREMONY_SHOW_SEATING != "false"
        ) {
          if (!(receiving_order_number && seat_code))
            return (
              <Text type="body-medium" className="mb-1">
                {t("ineligibleForCeremony")}
              </Text>
            );
          return (
            <ChipSet className="pb-2">
              <AssistChip
                icon={<MaterialIcon icon="group" />}
                onClick={() => setOrderOpen(true)}
              >
                {t("action.order", { order: receiving_order_number })}
              </AssistChip>
              <ReceivingOrderDialog
                open={orderOpen}
                receivingOrder={receiving_order_number}
                onClose={() => setOrderOpen(false)}
              />

              <AssistChip
                icon={<MaterialIcon icon="event_seat" />}
                onClick={() => setSeatOpen(true)}
              >
                {t("action.seat", { seat: seat_code })}
              </AssistChip>
              <SeatDialog
                open={seatOpen}
                seat={seat_code}
                onClose={() => setSeatOpen(false)}
              />
            </ChipSet>
          );
        }
      })()}

      {/* If inEnrollmentPeriod is implemented, use that instead. */}
      {currentAcademicYear == year &&
        process.env.NEXT_PUBLIC_CERTIFICATES_CEREMONY_ENROLLMENT_PERIOD ==
          "true" && (
          <CertificateCeremonyCard
            personID={personID}
            person={person}
            certificates={certificates}
          />
        )}

      {/* List */}
      <ul role="list" className="contents">
        {certificates?.map((certificate) => (
          <li key={certificate.id}>
            <CertificateCard certificate={certificate} />
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default CertificatesYearSection;
