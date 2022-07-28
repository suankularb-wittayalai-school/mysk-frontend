// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Backend
import { getForm } from "@utils/backend/news/form";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { FormPage as FormPageType } from "@utils/types/news";

const FormPage: NextPage<{ form: FormPageType }> = ({ form }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  // TODO: Render Form
  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(form.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={form}>
        <section className="mt-12">
          {form.content.fields.map((field) => (
            <div key={field.id}>{JSON.stringify(field)}</div>
          ))}
        </section>
      </NewsPageWrapper>
    </>
  );
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
