// Modules
import { AnimatePresence, motion } from "framer-motion";

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  ChipRadioGroup,
  Header,
  KeyboardInput,
  MaterialIcon,
  RegularLayout,
  Section,
  SnackbarManager,
  TextArea,
  Title,
} from "@suankularb-components/react";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { createInfo, updateInfo } from "@utils/backend/news/info";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import {
  LangCode,
  MultiLangString,
  WaitingSnackbar,
} from "@utils/types/common";
import { InfoDB } from "@utils/types/database/news";
import { NewsItemInfoNoDate } from "@utils/types/news";
import BlockingPane from "@components/BlockingPane";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/router";

type Form = {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  bodyTH: string;
  bodyEN: string;
  oldURL: string;
};

const ConfigSection = ({
  existingData,
  form,
  setForm,
}: {
  existingData?: NewsItemInfoNoDate;
  form: Form;
  setForm: (form: Form) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="settings" allowCustomSize />}
        text={t("articleEditor.config.title")}
      />
      <div>
        <div className="layout-grid-cols-3 !gap-y-0">
          <KeyboardInput
            name="title-th"
            type="text"
            label={t("articleEditor.config.titleTH")}
            onChange={(e) => setForm({ ...form, titleTH: e })}
            defaultValue={existingData?.content.title.th}
          />
          <KeyboardInput
            name="title-en"
            type="text"
            label={t("articleEditor.config.titleEN")}
            onChange={(e) => setForm({ ...form, titleEN: e })}
            defaultValue={existingData?.content.title["en-US"]}
          />
          <KeyboardInput
            name="old-url"
            type="url"
            label={t("articleEditor.config.oldURL")}
            helperMsg={t("articleEditor.config.oldURL_helper")}
            onChange={(e) => setForm({ ...form, oldURL: e })}
            defaultValue={existingData?.oldURL}
          />
        </div>
        <div className="layout-grid-cols-2 !gap-y-0">
          <TextArea
            name="desc-th"
            label={t("articleEditor.config.descTH")}
            onChange={(e) => setForm({ ...form, descTH: e })}
            defaultValue={existingData?.content.description.th}
          />
          <TextArea
            name="desc-en"
            label={t("articleEditor.config.descEN")}
            onChange={(e) => setForm({ ...form, descEN: e })}
            defaultValue={existingData?.content.description["en-US"]}
          />
        </div>
      </div>
    </Section>
  );
};

const WriteSection = ({
  existingBody,
  form,
  setBody: setExtBody,
  publish,
  allowEdit,
  allowEditEN,
  allowPublish,
}: {
  existingBody?: MultiLangString;
  form: Omit<Form, "bodyTH" | "bodyEN" | "oldURL">;
  setBody: (form: { th: string; "en-US": string }) => void;
  publish: () => void;
  allowEdit?: boolean;
  allowEditEN?: boolean;
  allowPublish?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const [lang, setLang] = useState<LangCode>("th");
  const [body, setBody] = useState<{ th: string; "en-US": string }>({
    th: "",
    "en-US": "",
  });

  useEffect(() => setExtBody(body), [body]);

  return (
    <Section className="relative">
      {/* Block editing if not configured */}
      <BlockingPane
        icon={<MaterialIcon icon="front_hand" allowCustomSize />}
        text={t("articleEditor.write.editNotAllowed")}
        show={!allowEdit}
      />

      {/* Header */}
      <Header
        icon={<MaterialIcon icon="edit_square" allowCustomSize />}
        text={t("articleEditor.write.title")}
      />

      {/* Choose language */}
      <ChipRadioGroup
        choices={[
          { id: "th", name: "ภาษาไทย" },
          { id: "en-US", name: "English" },
        ]}
        onChange={setLang}
        value={lang}
      />

      <div className="layout-grid-cols-2 relative !flex-col-reverse !gap-y-4">
        {/* Block editing English if not configured */}
        <BlockingPane
          icon={<MaterialIcon icon="translate" allowCustomSize />}
          text={t("articleEditor.write.enEditNotAllowed")}
          show={lang == "en-US" && allowEdit && !allowEditEN}
        />

        {/* Text area */}
        <section className="flex flex-col gap-2">
          {/* Link to Markdown Cheat Sheet */}
          <a
            aria-labelledby="markdown-how-to"
            href="/help/guide/admin/news#markdown"
            target="_blank"
            rel="noreferrer"
          >
            <Card type="horizontal" appearance="tonal" hasAction>
              <CardHeader
                title={
                  <h3 id="markdown-how-to">
                    {t("articleEditor.write.howTo.title")}
                  </h3>
                }
                label={t("articleEditor.write.howTo.supportingText")}
                end={<MaterialIcon icon="open_in_new" />}
              />
            </Card>
          </a>

          {/* Markdown editor */}
          <TextArea
            name="markdown"
            label={t("articleEditor.write.editorPlh")}
            onChange={(e) =>
              setBody(
                lang == "en-US"
                  ? // Change English version if editing English
                    { ...body, "en-US": e }
                  : // Change Thai version if editing Thai
                    { ...body, th: e }
              )
            }
            defaultValue={existingBody?.th}
          />
        </section>

        {/* Preview */}
        <section
          role="document"
          className="markdown h-fit rounded-lg border-outline !p-4 transition-[height]"
        >
          <h1 className="mb-2">
            {form[lang == "en-US" ? "titleEN" : "titleTH"]}
          </h1>
          <p className="mt-0 !font-display !text-lg">
            {form[lang == "en-US" ? "descEN" : "descTH"]}
          </p>
          {body ? (
            <ReactMarkdown remarkPlugins={[gfm]}>{body[lang]}</ReactMarkdown>
          ) : (
            <p className="container-surface-variant rounded p-4 text-center">
              {t("articleEditor.write.previewPlh")}
            </p>
          )}
        </section>
      </div>
      <Actions>
        <Button
          label={t("articleEditor.write.action.save")}
          type="outlined"
          icon={<MaterialIcon icon="save" />}
          disabled={!allowPublish}
        />
        <Button
          label={t("articleEditor.write.action.publish")}
          type="filled"
          icon={<MaterialIcon icon="publish" />}
          disabled={!allowPublish}
          onClick={publish}
        />
      </Actions>
    </Section>
  );
};

const ArticleEditor = ({
  mode,
  existingData,
  addToSnbQueue,
}: {
  mode: "add" | "edit";
  existingData?: NewsItemInfoNoDate;
  addToSnbQueue?: (newSnb: WaitingSnackbar) => void;
}): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation("common");

  // Form control
  const [form, setForm] = useState<Form>({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    bodyTH: "",
    bodyEN: "",
    oldURL: "",
  });

  useEffect(() => {
    if (existingData)
      setForm({
        titleTH: existingData.content.title.th,
        titleEN: existingData.content.title["en-US"] || "",
        descTH: existingData.content.description.th,
        descEN: existingData.content.description["en-US"] || "",
        bodyTH: existingData.content.body?.th || "",
        bodyEN: existingData.content.body?.["en-US"] || "",
        oldURL: existingData.oldURL || "",
      });
  }, [existingData]);

  // Validation
  function validateConfig(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;

    return true;
  }

  function evalAllowEditEN(): boolean {
    if (!form.titleEN) return false;
    if (!form.descEN) return false;

    return true;
  }

  function validate(): boolean {
    if (!validateConfig) return false;
    if (!form.bodyTH) return false;

    return true;
  }

  // Publishing feedback
  function showPublishingFeedback(data: any, error: PostgrestError | null) {
    if (addToSnbQueue) {
      if (error)
        addToSnbQueue({
          id: "publish-error",
          text: t("error", { errorMsg: error.message }),
        });
      else if (data) router.push("/t/admin/news");
    }
  }

  // Publish article
  async function publish() {
    if (mode == "add") {
      const { data, error } = await createInfo(form);
      showPublishingFeedback(data, error);
    } else if (mode == "edit" && existingData) {
      const { data, error } = await updateInfo(existingData.id, form);
      showPublishingFeedback(data, error);
    }
  }

  return (
    <>
      <ConfigSection
        existingData={existingData}
        form={form}
        setForm={setForm}
      />
      <WriteSection
        existingBody={existingData?.content.body}
        form={form}
        setBody={(e) => setForm({ ...form, bodyTH: e.th, bodyEN: e["en-US"] })}
        allowEdit={validateConfig()}
        allowEditEN={evalAllowEditEN()}
        allowPublish={validate()}
        publish={publish}
      />
    </>
  );
};

export default ArticleEditor;
