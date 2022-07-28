// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Backend
import { getForm } from "@utils/backend/news/form";

// Type
import { FormPage as FormPageType } from "@utils/types/news";
import { LangCode } from "@utils/types/common";

const FormPage: NextPage<{ form: FormPageType }> = ({ form }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  // TODO: Render Form
  return <div>{JSON.stringify(form)}</div>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  if (!params?.formID) return { notFound: true };

  const { data: form, error } = await getForm(Number(params?.formID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common"])),
      form,
    },
  };
};

export default FormPage;
