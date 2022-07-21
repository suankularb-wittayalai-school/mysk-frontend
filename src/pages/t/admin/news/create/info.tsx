// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  RegularLayout,
  SnackbarManager,
  Title,
} from "@suankularb-components/react";

// Components
import ArticleEditor from "@components/news/ArticleEditor";

// Backend
import { createInfo } from "@utils/backend/news/info";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useProtectPageFor } from "@utils/hooks/protect";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";
import { PublishArticle } from "@components/news/PublishArticle";

// Page
const CreateInfo: NextPage = (): JSX.Element => {
  const { t } = useTranslation("admin");

  useProtectPageFor("admin");

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
            backGoesTo="/t/admin/news"
            LinkElement={Link}
          />
        }
      >
        <ArticleEditor
          mode="add"
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <PublishArticle
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
