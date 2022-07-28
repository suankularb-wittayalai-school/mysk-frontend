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
import { protectPageFor } from "@utils/helpers/route";
import {
  Dropdown,
  KeyboardInput,
  NativeInput,
  TextArea,
} from "@suankularb-components/react";

const FormPage: NextPage<{ form: FormPageType }> = ({ form }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  const fieldTypes = [
    "short_answer",
    "paragraph",
    "multiple_choice",
    "check_box",
    "dropdown",
    "file",
    "date",
    "time",
    "scale",
  ];

  // TODO: Render Form
  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(form.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={form}>
        <section className="mt-12 flex flex-col items-center">
          {form.content.fields.map((field) =>
            // Short answer
            field.type == "short_answer" ? (
              <KeyboardInput
                key={field.id}
                name={getLocaleString(field.label, locale)}
                type="text"
                label={getLocaleString(field.label, locale)}
                onChange={() => {}}
                className="w-[calc(33.33%-0.6666rem)]"
              />
            ) : // Paragraph
            field.type == "paragraph" ? (
              <TextArea
                key={field.id}
                name={getLocaleString(field.label, locale)}
                label={getLocaleString(field.label, locale)}
                onChange={() => {}}
                className="w-[calc(33.33%-0.6666rem)]"
              />
            ) : // Date and time
            ["date", "time"].includes(field.type) ? (
              <NativeInput
                key={field.id}
                name={getLocaleString(field.label, locale)}
                type={field.type as "date" | "time"}
                label={getLocaleString(field.label, locale)}
                onChange={() => {}}
                className="w-[calc(33.33%-0.6666rem)]"
              />
            ) : // Dropdown
            field.type == "dropdown" ? (
              <Dropdown
                key={field.id}
                name={getLocaleString(field.label, locale)}
                label={getLocaleString(field.label, locale)}
                options={(field.options as string[]).map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-[calc(33.33%-0.6666rem)]"
              />
            ) : null
          )}
        </section>
      </NewsPageWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const redirect = await protectPageFor("student", req);
  if (redirect) return redirect;

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
