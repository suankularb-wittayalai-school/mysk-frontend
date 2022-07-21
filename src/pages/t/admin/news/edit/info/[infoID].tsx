// Modules
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  SnackbarManager,
  Title,
} from "@suankularb-components/react";

// Backend
import { getInfo, updateInfo } from "@utils/backend/news/info";

// Components
import ArticleConfig from "@components/news/ArticleConfig";
import { ArticlePublish } from "@components/news/ArticlePublish";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { protectPageFor } from "@utils/helpers/route";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";
import { NewsItemInfoNoDate } from "@utils/types/news";

// Page
const EditInfo: NextPage<{ existingData: NewsItemInfoNoDate }> = ({
  existingData,
}): JSX.Element => {
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
          {createTitleStr(t("articleEditor.title.title.edit.info"), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.title.edit.info"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/t/admin/news"
            LinkElement={Link}
          />
        }
      >
        <ArticleConfig
          mode="edit"
          existingData={existingData}
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <ArticlePublish
          handlePublish={async () => await updateInfo(existingData.id, form)}
          allowPublish={validate()}
        />
      </RegularLayout>
      <SnackbarManager queue={snbQueue} setQueue={setSnbQueue} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const redirect = await protectPageFor("admin", req);
  if (redirect) return redirect;

  if (!params?.infoID) return { notFound: true };

  const existingData = await getInfo(Number(params.infoID));
  if (!existingData) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      existingData,
    },
  };
};

export default EditInfo;
