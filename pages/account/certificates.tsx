import ProfileLayout from "@/components/account/ProfileLayout";
import CertificateCard from "@/components/account/certificates/CertificateCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getCertificatesOfPerson from "@/utils/backend/certificate/getCertificatesOfPerson";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { StudentCertificate } from "@/utils/types/certificate";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Card, Header, Section, Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group } from "radash";
import Balancer from "react-wrap-balancer";

/**
 * The Certificates page displays all Student Certificates of the current user.
 *
 * @param certificates The Student Certificates to display.
 */
const CertificatesPage: CustomPage<{
  certificates: StudentCertificate[];
}> = ({ certificates }) => {
  const locale = useLocale();
  const { t } = useTranslation("account", { keyPrefix: "certificates" });
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <ProfileLayout role={UserRole.student} className="space-y-6">
        {certificates.length > 0 ? (
          // Group Certificates by academic year.
          Object.entries(group(certificates, (certificate) => certificate.year))
            // Sort by academic year, descending.
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([year, certificates]) => (
              // Each year is a Section.
              <Section key={year} className="!gap-2">
                <Header level={3}>
                  {String(getLocaleYear(locale, Number(year), "AD"))}
                </Header>
                <ul className="contents">
                  {certificates?.map((certificate) => (
                    <li key={certificate.id}>
                      <CertificateCard certificate={certificate} />
                    </li>
                  ))}
                </ul>
              </Section>
            ))
        ) : (
          // If there are no certificates, display a message with a link to the
          // help form.
          <Section className="h-full pb-9">
            <Card
              appearance="outlined"
              className="h-full !bg-transparent px-6 py-12"
            >
              <Text
                type="body-medium"
                className="my-auto text-center text-on-surface-variant"
              >
                <Balancer>
                  <Trans i18nKey="certificates.empty" ns="account">
                    <a
                      href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    />
                  </Trans>
                </Balancer>
              </Text>
            </Card>
          </Section>
        )}

        {/* Link for reporting Certificate mistakes */}
        {certificates.length > 0 && (
          <Text type="label-medium" element="p">
            <Trans i18nKey="certificates.help" ns="account">
              <a
                href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="link"
              />
            </Trans>
          </Text>
        )}
      </ProfileLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);
  const { data: personID } = await getPersonIDFromUser(supabase, user!);

  const { data: certificates } = await getCertificatesOfPerson(
    supabase,
    personID!,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      certificates,
    },
  };
};

export default CertificatesPage;
