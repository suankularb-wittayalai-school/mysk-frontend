// External libraries
import { FormEvent, useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Actions,
  Checklist,
  Dropdown,
  FileInput,
  FormButton,
  FormElement,
  KeyboardInput,
  NativeInput,
  RadioGroup,
  Range,
  TextArea,
} from "@suankularb-components/react";

// Components
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Backend
import { getForm } from "@utils/backend/news/form";

// Helpers
import { replaceWhen } from "@utils/helpers/array";
import { getLocaleString } from "@utils/helpers/i18n";
import { protectPageFor } from "@utils/helpers/route";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { FormField, FormPage as FormPageType } from "@utils/types/news";

const FormPage: NextPage<{ formPage: FormPageType }> = ({ formPage }) => {
  const { t } = useTranslation(["news", "common"]);
  const locale = useRouter().locale as LangCode;

  type FormControlField = {
    id: number;
    label: string;
    value: string | number | string[] | File | null;
    required: boolean;
  };

  // Form control
  const [form, setForm] = useState<FormControlField[]>(
    formPage.content.fields.map((field) => ({
      id: field.id,
      label: getLocaleString(field.label, locale),
      value: ["short_answer", "paragraph"].includes(field.type)
        ? ""
        : field.type == "scale"
        ? 0
        : null,
      required: field.required,
    }))
  );

  function updateForm(newValue: FormControlField["value"], field: FormField) {
    replaceWhen(form, (item: FormControlField) => field.id == item.id, {
      label: getLocaleString(field.label, locale),
      value: newValue,
      required: field.required,
    } as FormControlField);
  }

  function handleReset(e: FormEvent) {
    e.preventDefault();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(formPage.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={formPage}>
        <form
          className="mt-12 flex flex-col items-center"
          onReset={handleReset}
          onSubmit={handleSubmit}
        >
          <div className="w-full sm:w-1/2 md:w-1/3">
            {formPage.content.fields.map((field) =>
              // Short answer
              field.type == "short_answer" ? (
                <KeyboardInput
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  type="text"
                  label={getLocaleString(field.label, locale)}
                  onChange={(e) => updateForm(e, field)}
                />
              ) : // Paragraph
              field.type == "paragraph" ? (
                <TextArea
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  label={getLocaleString(field.label, locale)}
                  onChange={(e) => updateForm(e, field)}
                />
              ) : // Date and time
              ["date", "time"].includes(field.type) ? (
                <NativeInput
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  type={field.type as "date" | "time"}
                  label={getLocaleString(field.label, locale)}
                  onChange={(e) => updateForm(e, field)}
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
                  noOptionsText={t("input.none.noOptions", { ns: "common" })}
                  onChange={(e: string) => updateForm(e, field)}
                />
              ) : // File
              field.type == "file" ? (
                <FileInput
                  key={field.id}
                  name={getLocaleString(field.label, locale)}
                  label={getLocaleString(field.label, locale)}
                  noneAttachedMsg={t("input.none.noFilesAttached", {
                    ns: "common",
                  })}
                  onChange={(e) => updateForm(e, field)}
                />
              ) : ["multiple_choice", "check_box", "scale"].includes(
                  field.type
                ) ? (
                <FormElement label={getLocaleString(field.label, locale)} className="!mb-6">
                  {field.type == "multiple_choice" ? (
                    // Multiple choice
                    <RadioGroup
                      name={getLocaleString(field.label, locale)}
                      options={(field.options as string[]).map((option) => ({
                        id: option,
                        value: option,
                        label: option,
                      }))}
                      onChange={(e) => updateForm(e, field)}
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
                      onChange={(e: string[]) => updateForm(e, field)}
                    />
                  ) : field.type == "scale" ? (
                    // Scale
                    <Range
                      name={getLocaleString(field.label, locale)}
                      min={field.range.start}
                      max={field.range.end}
                      onChange={(e) => updateForm(e, field)}
                    />
                  ) : null}
                </FormElement>
              ) : null
            )}
          </div>
          <Actions className="w-full">
            <FormButton
              label={t("pageAction.form.reset")}
              type="reset"
              appearance="outlined"
              disabled
            />
            <FormButton
              label={t("pageAction.form.submit")}
              type="submit"
              appearance="filled"
            />
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

  const { data: formPage, error } = await getForm(Number(params?.formID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      formPage,
    },
  };
};

export default FormPage;
