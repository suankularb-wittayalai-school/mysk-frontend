// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { Role } from "@utils/types/person";

const AccountDetails: NextPage<{ role: Role; isAdmin: boolean }> = ({
  role,
  isAdmin,
}) => {
  const { t } = useTranslation("account");

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title"),
            }}
            pageIcon={<MaterialIcon icon="account_circle" />}
            backGoesTo={role == "teacher" ? "/teach" : "/learn"}
            LinkElement={Link}
          />
        }
      >
        <p>TODO</p>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
      ])),
    },
  };
};

export default AccountDetails;
