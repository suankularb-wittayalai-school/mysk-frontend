// External libraries
import { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import FormField from "@/components/news/FormField";
import NewsMeta from "@/components/news/NewsMeta";
import NewsPageHeader from "@/components/news/NewsPageHeader";

// Backend
import { getForm, sendForm } from "@/utils/backend/news/form";
import { getPersonIDFromUser } from "@/utils/backend/person/person";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { FormPage as FormPageType } from "@/utils/types/news";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const FormPage: CustomPage<{ formPage: FormPageType; personID: number }> = ({
  formPage,
  personID,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["news", "common"]);

  // Routing
  const router = useRouter();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const [form, setForm] = useState<{
    [label: string]: string | number | string[] | File | null;
  }>(
    formPage.content.fields.reduce(
      (form, field) => ({
        ...form,
        [getLocaleString(field.label, locale)]:
          field.type == "scale"
            ? field.default
              ? Number(field.default)
              : 0
            : field.default ||
              (["short_answer", "paragraph"].includes(field.type) ? "" : null),
      }),
      {}
    )
  );

  // Form validation
  function validate(): boolean {
    const requiredButEmpty = Object.keys(form).find(
      (field) =>
        formPage.content.fields.find(
          (pageField) => field === getLocaleString(pageField.label, locale)
        )?.required && !form[field]
    );

    if (requiredButEmpty) {
      setSnackbar(
        <Snackbar>
          {t("snackbar.requiredButEmpty", { field: requiredButEmpty })}
        </Snackbar>
      );
      return false;
    }

    return true;
  }

  // Form submission
  async function handleSubmit() {
    if (!validate()) return;

    const { error } = await sendForm(
      formPage.id,
      Object.keys(form).map((field) => ({
        id: formPage.content.fields.find(
          (pageField) => field === getLocaleString(pageField.label, locale)
        )!.id,
        value: form[field],
      })),
      personID
    );

    if (error) return;

    await router.push("/news");
    setSnackbar(<Snackbar>{t("snackbar.success")}</Snackbar>);
  }

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(formPage.content.title, locale), t)}
        </title>
      </Head>
      <NewsMeta newsItem={formPage} />
      <NewsPageHeader newsItem={formPage} />

      <ContentLayout>
        <Columns columns={3}>
          <div
            id="form"
            className="mx-4 flex scroll-m-16 flex-col gap-4 sm:col-span-2
              sm:mx-0 md:col-span-1 md:col-start-2"
          >
            {formPage.content.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={form[getLocaleString(field.label, locale)]!}
                onChange={(value) =>
                  setForm({
                    ...form,
                    [getLocaleString(field.label, locale)]: value,
                  })
                }
              />
            ))}
          </div>
        </Columns>
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="send" />}
            onClick={handleSubmit}
            className="!w-full sm:!w-fit"
          >
            {t("action.form.submit")}
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await supabase.auth.getUser();
  const { data: personID } = await getPersonIDFromUser(
    supabase,
    user.user as User
  );

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

FormPage.pageRole = "student";

export default FormPage;
