import ProfileLayout from "@/components/account/ProfileLayout";
import CertificatesYearSection from "@/components/account/certificates/CertificatesYearSection";
import ReportIssueButton from "@/components/common/ReportIssueButton";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getCertificatesOfPerson from "@/utils/backend/certificate/getCertificatesOfPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import { StudentCertificate } from "@/utils/types/certificate";
import { CustomPage } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { Actions, Card, Section, Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { group, sort } from "radash";
import Balancer from "react-wrap-balancer";
import { CeremonyConfirmationStatus } from "@/utils/types/certificate";

/**
 * The Certificates page displays all Student Certificates of the current user.
 *
 * @param certificates The Student Certificates to display.
 */
const CertificatesPage: CustomPage<{
  certificates: StudentCertificate[];
  person: Student;
  rsvpStatus: Boolean;
  enrollmentStatus: CeremonyConfirmationStatus;
}> = ({ certificates, person, rsvpStatus, enrollmentStatus }) => {
  const { t } = useTranslation("account/certificates");

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <ProfileLayout title={t("title")} className="space-y-6">
        {/* {false ? ( */}
        {certificates.length > 0 ? (
          // Group Certificates by academic year.
          sort(
            Object.entries(
              group(certificates, (certificate) => certificate.year),
            ),
            // Sort by academic year, ascending.
            ([year]) => Number(year),
            true,
          ).map(([year, certificates]) => (
            // Each year is a Section.
            <CertificatesYearSection
              key={year}
              year={Number(year)}
              certificates={certificates!}
              person={person}
              rsvpStatus={rsvpStatus}
              enrollmentStatus={enrollmentStatus}
            />
          ))
        ) : (
          // If there are no certificates, display a message with a link to the
          // help form.
          <Section className="h-full pb-9">
            <Card
              appearance="outlined"
              className="h-full items-center !justify-center gap-4 !bg-transparent px-6 py-12"
            >
              <Text
                type="body-medium"
                element="p"
                className="text-center text-on-surface-variant"
              >
                <Balancer>{t("empty")}</Balancer>
              </Text>
              <ReportIssueButton appearance="text" location="Certificates" />
            </Card>
          </Section>
        )}

        {/* Link for reporting Certificate mistakes */}
        {certificates.length > 0 && (
          <Actions align="center">
            <ReportIssueButton appearance="text" location="Certificates" />
          </Actions>
        )}
      </ProfileLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  
  const { data: personID } = await getPersonIDFromUser(supabase, mysk.user!);

  const { data: certificates } = await getCertificatesOfPerson(
    supabase,
    personID!,
  );

  const { data: person } = await getLoggedInPerson(supabase, mysk, {
    detailed: true,
  });

  const { data: rsvpStatus } = await mysk.fetch(
    "/v1/certificates/rsvp/in-rsvp-period",
  );

  const { data: enrollmentStatus } = await mysk.fetch(
    `/v1/certificates/rsvp/${person?.id}`,
  );

  return {
    props: { certificates, personID, person, rsvpStatus, enrollmentStatus },
  };
};

export default CertificatesPage;
