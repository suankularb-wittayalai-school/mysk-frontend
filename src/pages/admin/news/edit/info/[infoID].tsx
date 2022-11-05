// External libraries
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  SnackbarManager,
  Title,
} from "@suankularb-components/react";

// Backend
import { getInfo, updateInfo } from "@utils/backend/news/info";

// Components
import AddImageToNewsDialog from "@components/dialogs/AddImageToNews";
import ArticleConfig from "@components/news/ArticleConfig";
import ArticlePublish from "@components/news/ArticlePublish";
import ArticleWrite from "@components/news/ArticleWrite";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";
import { InfoPage } from "@utils/types/news";

// Page
const EditInfo: NextPage<{ existingData: InfoPage }> = ({
  existingData,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const supabase = useSupabaseClient();

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
    titleTH: existingData.content.title.th,
    titleEN: existingData.content.title["en-US"] || "",
    descTH: existingData.content.description.th,
    descEN: existingData.content.description["en-US"] || "",
    bodyTH: existingData.content.body?.th || "",
    bodyEN: existingData.content.body?.["en-US"] || "",
    image: null,
    oldURL: existingData.oldURL || "",
  });

  function validate(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;
    if (!form.bodyTH) return false;

    return true;
  }

  // Snackbar control
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  // Dialog control
  const [showAddImage, toggleShowAddImage] = useToggle();

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
            backGoesTo="/admin/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <p>{t("articleEditor.typeDesc.info")}</p>
        </Section>
        <ArticleConfig
          mode="edit"
          existingData={existingData}
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <ArticleWrite
          existingBody={existingData.content.body}
          form={{
            titleTH: form.titleTH,
            titleEN: form.titleEN,
            descTH: form.descTH,
            descEN: form.descEN,
          }}
          setBody={(incBody) =>
            setForm({ ...form, bodyTH: incBody.th, bodyEN: incBody["en-US"] })
          }
          toggleShowAddImage={toggleShowAddImage}
        />
        <ArticlePublish
          handlePublish={async () => await updateInfo(supabase, existingData.id, form)}
          allowPublish={validate()}
        />
      </RegularLayout>

      {/* Snackbars */}
      <SnackbarManager queue={snbQueue} setQueue={setSnbQueue} />

      {/* Dialogs */}
      <AddImageToNewsDialog
        show={showAddImage}
        onClose={toggleShowAddImage}
        fileDestination={`info/${existingData.id}`}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  if (!params?.infoID) return { notFound: true };

  const { data: existingData } = await getInfo(Number(params.infoID));
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
