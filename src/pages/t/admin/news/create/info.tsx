// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import ReactMarkdown from "react-markdown";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  Header,
  KeyboardInput,
  MaterialIcon,
  RegularLayout,
  Section,
  TextArea,
  Title,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

const ConfigSection = (): JSX.Element => {
  const [form, setForm] = useState({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    oldURL: "",
  });

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="settings" allowCustomSize />}
        text="Configure"
      />
      <div>
        <div className="layout-grid-cols-3 !gap-y-0">
          <KeyboardInput
            name="title-th"
            type="text"
            label="Local title (Thai)"
            onChange={(e) => setForm({ ...form, titleTH: e })}
          />
          <KeyboardInput
            name="title-en"
            type="text"
            label="English title"
            onChange={(e) => setForm({ ...form, titleEN: e })}
          />
          <KeyboardInput
            name="old-url"
            type="url"
            label="Link in legacy MySK"
            helperMsg="If this page exists in legacy MySK, link to it."
            onChange={(e) => setForm({ ...form, oldURL: e })}
          />
        </div>
        <div className="layout-grid-cols-2 !gap-y-0">
          <TextArea
            name="desc-th"
            label="Local description (Thai)"
            onChange={(e) => setForm({ ...form, descTH: e })}
          />
          <TextArea
            name="desc-en"
            label="English description"
            onChange={(e) => setForm({ ...form, descEN: e })}
          />
        </div>
      </div>
    </Section>
  );
};

const WriteSection = (): JSX.Element => {
  const [pageMarkdown, setPageMarkdown] = useState<string>("");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="edit_square" allowCustomSize />}
        text="Write"
      />
      <div className="layout-grid-cols-2 !flex-col-reverse !gap-y-4">
        {/* Text area */}
        <section className="flex flex-col gap-2">
          <a
            aria-labelledby="markdown-how-to"
            href="/help/guide/admin/news#markdown"
            target="_blank"
            rel="noreferrer"
          >
            <Card type="horizontal" appearance="tonal" hasAction>
              <CardHeader
                title={<h3 id="markdown-how-to">Markdown how-to</h3>}
                label="Read the guide on how to write in Markdown"
                end={<MaterialIcon icon="open_in_new" />}
              />
            </Card>
          </a>
          <TextArea
            name="markdown"
            label="Markdown"
            onChange={(e) => setPageMarkdown(e)}
          />
        </section>

        {/* Preview */}
        <section className="markdown h-fit rounded-lg border-outline !p-4">
          {pageMarkdown ? (
            <ReactMarkdown>{pageMarkdown}</ReactMarkdown>
          ) : (
            <p className="text-center">Start typing to see the preview.</p>
          )}
        </section>
      </div>
      <Actions>
        <Button
          label="Save"
          type="outlined"
          icon={<MaterialIcon icon="save" />}
        />
        <Button
          label="Publish"
          type="filled"
          icon={<MaterialIcon icon="publish" />}
        />
      </Actions>
    </Section>
  );
};

// Page
const CreateInfo: NextPage = (): JSX.Element => {
  const { t } = useTranslation("admin");
  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.add"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/t/admin/news"
            LinkElement={Link}
          />
        }
      >
        <ConfigSection />
        <WriteSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "admin"])),
  },
});

export default CreateInfo;
