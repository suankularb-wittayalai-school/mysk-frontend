// Modules
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
import ArticlePublish from "@components/news/ArticlePublish";
import ArticleWrite from "@components/news/ArticleWrite";

// Backend
import { createInfo } from "@utils/backend/news/info";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";

// Page
const CreateInfo: NextPage = (): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [form, setForm] = useState<{
    titleTH: string;
    titleEN: string;
    descTH: string;
    descEN: string;
    bodyTH: string;
    bodyEN: string;
    image: File | null;
    oldURL: string;
  }>({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    bodyTH: "",
    bodyEN: "",
    image: null,
    oldURL: "",
  });

  function validate(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;
    if (!form.bodyTH) return false;

    return true;
  }

  // Snackbar control
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("articleEditor.title.title.add.info"), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.title.add.info"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/admin/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <p>{t("articleEditor.typeDesc.stats")}</p>
        </Section>
        {/* (`inc` for “incoming”) */}
        <ArticleConfig
          mode="add"
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <ArticleWrite
          form={{
            titleTH: form.titleTH,
            titleEN: form.titleEN,
            descTH: form.descTH,
            descEN: form.descEN,
          }}
          setBody={(incBody) =>
            setForm({ ...form, bodyTH: incBody.th, bodyEN: incBody["en-US"] })
          }
        />
        <ArticlePublish
          handlePublish={async () => await createInfo(form)}
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

export default CreateInfo;
