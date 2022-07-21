// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Card,
  CardHeader,
  CardSupportingText,
  FileInput,
  Header,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  SnackbarManager,
  TextArea,
  Title,
} from "@suankularb-components/react";

// Components
import ArticleConfig from "@components/news/ArticleConfig";
import ArticlePublish from "@components/news/ArticlePublish";
import Markdown from "@components/Markdown";

// Backend
import { createInfo } from "@utils/backend/news/info";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useProtectPageFor } from "@utils/hooks/protect";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";

// Page
const CreateStats: NextPage = (): JSX.Element => {
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
    csvFile: File | null;
  }>({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    bodyTH: "",
    bodyEN: "",
    image: null,
    oldURL: "",
    csvFile: null,
  });

  function validate(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;
    if (!form.bodyTH) return false;
    if (!form.csvFile) return false;

    return true;
  }

  // Snackbar control
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("articleEditor.title.title.add.stats"), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.title.add.stats"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/t/admin/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <p>
            A statistics article allow you to neatly display data in a table
            presented to all teachers in the school. An example would be
            COVID-19 vaccination numbers.
          </p>
        </Section>
        <ArticleConfig
          mode="add"
          onFormChange={(incForm) => setForm({ ...form, ...incForm })}
        />
        <Section>
          <Header
            icon={<MaterialIcon icon="table" allowCustomSize />}
            text="Data"
          />
          <LayoutGridCols cols={3}>
            <Card type="stacked" appearance="outlined">
              <CardHeader
                icon={<MaterialIcon icon="folder_open" />}
                title={<h3>Import spreadsheet</h3>}
                label={<span>Display a file as a table</span>}
              />
              <CardSupportingText>
                <p>
                  Use a .csv or a .xlsx file as data to be displayed to the
                  user.
                </p>
                <FileInput name="spreadsheet-file" label="Spreadsheet file" />
              </CardSupportingText>
            </Card>
            <Card type="stacked" appearance="outlined">
              <CardHeader
                icon={<MaterialIcon icon="edit_square" />}
                title={<h3>Create Markdown table</h3>}
                label={<span>Use the Markdown syntax</span>}
              />
              <CardSupportingText>
                <TextArea
                  name="markdown"
                  label="Markdown"
                  onChange={() => {}}
                />
                <Markdown noStyles>{""}</Markdown>
              </CardSupportingText>
            </Card>
            <Card type="stacked" appearance="outlined">
              <CardHeader
                icon={<MaterialIcon icon="link" />}
                title={<h3>Link form</h3>}
                label={<span>Tally student responses</span>}
              />
              <CardSupportingText>
                <p>
                  Enter the link to the form from which you’d like to tally the
                  student responses. We only support forms made in MySK.
                </p>
                <KeyboardInput
                  name="form-link"
                  type="url"
                  label="Form link"
                  helperMsg="Starts with “https://mysk.school/form/”."
                  onChange={() => {}}
                />
              </CardSupportingText>
            </Card>
          </LayoutGridCols>
        </Section>
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

export default CreateStats;
