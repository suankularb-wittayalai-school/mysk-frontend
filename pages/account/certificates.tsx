import ProfileLayout from "@/components/account/ProfileLayout";
import CertificatesYearSection from "@/components/account/certificates/CertificatesYearSection";
import ReportIssueButton from "@/components/common/ReportIssueButton";
import getCertificatesOfPerson from "@/utils/backend/certificate/getCertificatesOfPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import { StudentCertificate } from "@/utils/types/certificate";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Actions, Card, Section, Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { group, sort } from "radash";
import Balancer from "react-wrap-balancer";

/**
 * The Certificates page displays all Student Certificates of the current user.
 *
 * @param certificates The Student Certificates to display.
 */
const CertificatesPage: CustomPage<{
  certificates: StudentCertificate[];
  personID: string;
}> = ({ certificates, personID }) => {
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
              personID={personID}
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

  return { props: { certificates, personID } };
};

export default CertificatesPage;
