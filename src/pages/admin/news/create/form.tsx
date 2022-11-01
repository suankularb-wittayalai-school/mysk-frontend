// External libraries
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  SnackbarManager,
  Title,
} from "@suankularb-components/react";

// Components
import ArticleConfig from "@components/news/ArticleConfig";
import ArticleForm from "@components/news/ArticleForm";
import ArticlePublish from "@components/news/ArticlePublish";

// Backend
import { createForm } from "@utils/backend/news/form";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";
import { FormField } from "@utils/types/news";

// Page
const CreateForm: NextPage = (): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [form, setForm] = useState<{
    titleTH: string;
    titleEN: string;
    descTH: string;
    descEN: string;
    image: File | null;
    oldURL: string;
    fields: Omit<FormField, "id">[];
  }>({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    image: null,
    oldURL: "",
    fields: [],
  });

  function validate(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;
    if (form.fields.length < 1) return false;

    return true;
  }

  // Snackbar control
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("articleEditor.title.title.add.form"), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.title.add.form"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/admin/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <p>{t("articleEditor.typeDesc.form")}</p>
        </Section>
        <ArticleConfig
          mode="add"
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <ArticleForm
          mode="add"
          setFields={(incFields) => setForm({ ...form, fields: incFields })}
        />
        <ArticlePublish
          handlePublish={async () => await createForm(form)}
          allowPublish={validate()}
        />
      </RegularLayout>
      <SnackbarManager queue={snbQueue} setQueue={setSnbQueue} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "admin"])),
  },
});

export default CreateForm;
