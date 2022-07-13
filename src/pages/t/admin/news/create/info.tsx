// Modules
import { AnimatePresence, motion } from "framer-motion";

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

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

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

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
  form,
  setForm,
}: {
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
          />
          <KeyboardInput
            name="title-en"
            type="text"
            label={t("articleEditor.config.titleEN")}
            onChange={(e) => setForm({ ...form, titleEN: e })}
          />
          <KeyboardInput
            name="old-url"
            type="url"
            label={t("articleEditor.config.oldURL")}
            helperMsg={t("articleEditor.config.oldURL_helper")}
            onChange={(e) => setForm({ ...form, oldURL: e })}
          />
        </div>
        <div className="layout-grid-cols-2 !gap-y-0">
          <TextArea
            name="desc-th"
            label={t("articleEditor.config.descTH")}
            onChange={(e) => setForm({ ...form, descTH: e })}
          />
          <TextArea
            name="desc-en"
            label={t("articleEditor.config.descEN")}
            onChange={(e) => setForm({ ...form, descEN: e })}
          />
        </div>
      </div>
    </Section>
  );
};

const WriteSection = ({
  title,
  desc,
  body,
  setBody,
  allowEdit,
  allowPublish,
}: {
  title: string;
  desc: string;
  body: string;
  setBody: (e: string) => void;
  allowEdit?: boolean;
  allowPublish?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section className="relative">
      <AnimatePresence>
        {allowEdit && (
          <motion.div
            className="absolute -top-4 -left-4 z-20 flex h-[calc(100%+2rem)] w-[calc(100%+2rem)]
              flex-col items-center justify-center gap-6 rounded-xl !p-6 text-center text-lg backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animationTransition}
          >
            <MaterialIcon
              icon="front_hand"
              allowCustomSize
              className="!text-9xl text-on-surface-variant"
            />
            <p>{t("articleEditor.write.editNotAllowed")}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Header
        icon={<MaterialIcon icon="edit_square" allowCustomSize />}
        text={t("articleEditor.write.title")}
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
          <TextArea
            name="markdown"
            label={t("articleEditor.write.editorPlh")}
            onChange={(e) => setBody(e)}
          />
        </section>

        {/* Preview */}
        <section
          role="document"
          className="markdown h-fit rounded-lg border-outline !p-4"
        >
          <h1 className="m-0">{title}</h1>
          <p className="mt-0 !font-display !text-lg">{desc}</p>
          {body ? (
            <ReactMarkdown remarkPlugins={[gfm]}>{body}</ReactMarkdown>
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
          disabled={allowPublish}
        />
        <Button
          label={t("articleEditor.write.action.publish")}
          type="filled"
          icon={<MaterialIcon icon="publish" />}
          disabled={allowPublish}
        />
      </Actions>
    </Section>
  );
};

// Page
const CreateInfo: NextPage = (): JSX.Element => {
  const { t } = useTranslation("admin");

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

  // Validation
  function validateConfig(): boolean {
    if (!form.titleTH) return false;
    if (!form.descTH) return false;

    return true;
  }

  function validate(): boolean {
    if (!validateConfig) return false;
    if (!form.bodyTH) return false;

    return true;
  }

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
        <ConfigSection form={form} setForm={setForm} />
        <WriteSection
          title={form.titleTH}
          desc={form.descTH}
          body={form.bodyTH}
          setBody={(e) => setForm({ ...form, bodyTH: e })}
          allowEdit={!validateConfig()}
          allowPublish={!validate()}
        />
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
