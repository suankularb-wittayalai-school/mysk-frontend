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

// Page
const CreateInfo: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation("admin");
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  useProtectPageFor("admin");

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
          handlePublish={async (form) => {
            const { data, error } = await createInfo(form);
            if (error)
              setSnbQueue([
                ...snbQueue,
                {
                  id: "publish-error",
                  text: t("error", {
                    errorMsg: error.message || "unknown error",
                  }),
                },
              ]);
            else if (data) router.push("/t/admin/news");
          }}
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
