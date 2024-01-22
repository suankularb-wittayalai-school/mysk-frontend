import ProfileLayout from "@/components/account/ProfileLayout";
import CertificateCard from "@/components/account/certificates/CertificateCard";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getCertificatesOfPerson from "@/utils/backend/certificate/getCertificatesOfPerson";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { StudentCertificate } from "@/utils/types/certificate";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Header, Section } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group } from "radash";
import { authOptions } from "../api/auth/[...nextauth]";

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
        {Object.entries(group(certificates, (certificate) => certificate.year))
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([year, certificates]) => (
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
          ))}
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
