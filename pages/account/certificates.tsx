import ProfileLayout from "@/components/account/ProfileLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getCertificatesOfPerson from "@/utils/backend/certificate/getCertificatesOfPerson";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import { StudentCertificate } from "@/utils/types/certificate";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Header, Section, Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group } from "radash";

const CertificatesPage: CustomPage<{
  certificates: StudentCertificate[];
}> = ({ certificates }) => {
  const { t } = useTranslation("account", { keyPrefix: "certificates" });
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <ProfileLayout role={UserRole.student}>
        {Object.entries(
          group(certificates, (certificate) => certificate.year),
        ).map(([year, certificates]) => (
          <Section key={year}>
            <Header level={3}>{year}</Header>
            <pre>{JSON.stringify(certificates, null, 2)}</pre>
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
