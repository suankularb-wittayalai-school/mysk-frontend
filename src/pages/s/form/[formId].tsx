// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";

// Type
import { Form } from "@utils/types/form";
import { getForm } from "@utils/backend/news/form";

const FormPage: NextPage<{ form: Form | null }> = ({ form }) => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  //   console.log(form);

  // TODO: render form
  return <div>FormPage</div>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const form: Form | null = await getForm(Number(params?.formId));

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
      form,
    },
  };
};

export default FormPage;
