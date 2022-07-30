// External libraries
import { useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { Actions, Button } from "@suankularb-components/react";

// Components
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Backend
import { getForm, sendForm } from "@utils/backend/news/form";
import { getPersonIDFromReq } from "@utils/backend/person/person";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import {
  FormField as FormFieldType,
  FormPage as FormPageType,
} from "@utils/types/news";
import FormField from "@components/news/FormField";

const FormPage: NextPage<{ formPage: FormPageType; personID: number }> = ({
  formPage,
  personID,
}) => {
  const { t } = useTranslation(["news", "common"]);
  const router = useRouter();
  const locale = router.locale as LangCode;

  type FormControlField = {
    id: number;
    value: string | number | string[] | File | null;
    required: boolean;
  };

  // Form control
  const [form, setForm] = useState<FormControlField[]>(
    formPage.content.fields.map((field) => ({
      id: field.id,
      value:
        field.default ||
        (["short_answer", "paragraph"].includes(field.type)
          ? ""
          : field.type == "scale"
          ? 0
          : null),
      required: field.required,
    }))
  );

  function updateForm(
    newValue: FormControlField["value"],
    field: FormFieldType
  ) {
    setForm(
      form.map((item) => {
        if (field.id == item.id)
          return { id: field.id, value: newValue, required: field.required };
        return item;
      })
    );
  }

  function validate(): boolean {
    if (form.find((field) => field.required && !field.value)) return false;
    return true;
  }

  async function handleSubmit() {
    if (!validate) return;

    const { error } = await sendForm(
      formPage.id,
      form.map((field) => ({ id: field.id, value: field.value })),
      personID
    );

    if (error) return;
    router.push("/news");
  }

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(formPage.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={formPage}>
        <section className="mt-12 flex flex-col items-center">
          <div className="w-full sm:w-1/2 md:w-1/3">
            {formPage.content.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                onChange={(e) => updateForm(e, field)}
              />
            ))}
          </div>
          <Actions className="w-full">
            <Button
              label={t("pageAction.form.submit")}
              type="filled"
              onClick={handleSubmit}
              disabled={!validate()}
            />
          </Actions>
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
  const personID = await getPersonIDFromReq(req);

  if (!params?.formID) return { notFound: true };

  const { data: formPage, error } = await getForm(Number(params?.formID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      formPage,
      personID,
    },
  };
};

export default FormPage;
