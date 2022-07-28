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
  Actions,
  Checklist,
  Dropdown,
  FormButton,
  FormElement,
  KeyboardInput,
  NativeInput,
  RadioGroup,
  Range,
  TextArea,
} from "@suankularb-components/react";
import { FormEvent } from "react";

const FormPage: NextPage<{ form: FormPageType }> = ({ form }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  function handleReset(e: FormEvent) {
    e.preventDefault();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  // TODO: Render Form
  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(form.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={form}>
        <form
          className="mt-12 flex flex-col items-center"
          onReset={handleReset}
          onSubmit={handleSubmit}
        >
          <div className="w-full sm:w-1/2 md:w-1/3">
            {form.content.fields.map((field) =>
              // Short answer
              field.type == "short_answer" ? (
                <KeyboardInput
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  type="text"
                  label={getLocaleString(field.label, locale)}
                  onChange={() => {}}
                />
              ) : // Paragraph
              field.type == "paragraph" ? (
                <TextArea
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  label={getLocaleString(field.label, locale)}
                  onChange={() => {}}
                />
              ) : // Date and time
              ["date", "time"].includes(field.type) ? (
                <NativeInput
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  type={field.type as "date" | "time"}
                  label={getLocaleString(field.label, locale)}
                  onChange={() => {}}
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
                />
              ) : ["multiple_choice", "check_box", "scale"].includes(
                  field.type
                ) ? (
                <FormElement label={getLocaleString(field.label, locale)}>
                  {field.type == "multiple_choice" ? (
                    // Multiple choice
                    <RadioGroup
                      name={getLocaleString(field.label, locale)}
                      options={(field.options as string[]).map((option) => ({
                        id: option,
                        value: option,
                        label: option,
                      }))}
                      onChange={() => {}}
                    />
                  ) : field.type == "check_box" ? (
                    // Check boxes
                    <Checklist
                      name={getLocaleString(field.label, locale)}
                      options={(field.options as string[]).map((option) => ({
                        id: option,
                        value: option,
                        label: option,
                      }))}
                      onChange={() => {}}
                    />
                  ) : field.type == "scale" ? (
                    // Scale
                    <Range
                      name={getLocaleString(field.label, locale)}
                      min={field.range.start}
                      max={field.range.end}
                      onChange={() => {}}
                    />
                  ) : null}
                </FormElement>
              ) : null
            )}
          </div>
          <Actions className="w-full">
            <FormButton label="Reset" type="reset" appearance="outlined" />
            <FormButton label="Submit form" type="submit" appearance="filled" />
          </Actions>
        </form>
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
