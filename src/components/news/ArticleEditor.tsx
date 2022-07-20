// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  MutableRefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  ChipRadioGroup,
  FileInput,
  Header,
  KeyboardInput,
  LinkButton,
  MaterialIcon,
  Section,
  TextArea,
} from "@suankularb-components/react";

// Components
import BlockingPane from "@components/BlockingPane";
import Markdown from "@components/Markdown";
import AddImageToNewsDialog from "@components/dialogs/AddImageToNews";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";

// Backend
import { createInfo, deleteInfo, updateInfo } from "@utils/backend/news/info";

// Types
import {
  LangCode,
  MultiLangString,
  WaitingSnackbar,
} from "@utils/types/common";
import { NewsItemInfoNoDate } from "@utils/types/news";

// Helpers
import { addAtIndex, wrapPartOfArray } from "@utils/helpers/array";

// Supabase
import { PostgrestError } from "@supabase/supabase-js";

type Form = {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  bodyTH: string;
  bodyEN: string;
  image: File | null;
  oldURL: string;
};

const ConfigSection = ({
  existingData,
  form,
  setForm,
  onClickDelete,
}: {
  existingData?: NewsItemInfoNoDate;
  form: Form;
  setForm: (form: Form) => void;
  onClickDelete?: () => void;
}): JSX.Element => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Section>
      <div className="layout-grid-cols-3">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="settings" allowCustomSize />}
            text={t("articleEditor.config.title")}
          />
        </div>
        <Actions>
          {onClickDelete && (
            <Button
              label={t("articleEditor.config.action.delete")}
              type="tonal"
              icon={<MaterialIcon icon="delete" />}
              onClick={onClickDelete}
              isDangerous
            />
          )}
        </Actions>
      </div>
      <div>
        <div className="layout-grid-cols-4 !gap-y-0">
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
          <FileInput
            name="image"
            label={t("articleEditor.config.image")}
            helperMsg={t("articleEditor.config.image_helper")}
            noneAttachedMsg={t(
              existingData?.image
                ? "input.none.noNewFilesAttached"
                : "input.none.noFilesAttached",
              { ns: "common" }
            )}
            onChange={(e) => setForm({ ...form, image: e })}
            attr={{ accept: "image/*" }}
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
  toggleShowAddImage,
  allowEdit,
  allowEditEN,
  allowPublish,
}: {
  existingBody?: MultiLangString;
  form: Omit<Form, "bodyTH" | "bodyEN" | "image" | "oldURL">;
  setBody: (form: { th: string; "en-US": string }) => void;
  publish: () => void;
  toggleShowAddImage?: () => void;
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

  // Incoming
  useEffect(() => {
    if (existingBody)
      setBody({
        th: existingBody.th,
        "en-US": existingBody["en-US"] || "",
      });
  }, [existingBody]);

  // Outgoing
  useEffect(() => setExtBody(body), [body]);

  // Toolbar
  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);

  function wrapSelectionWith(symbol: string) {
    if (!textAreaRef.current) return;

    setBody({
      ...body,
      [lang]: wrapPartOfArray(
        body[lang].split(""),
        textAreaRef.current.selectionStart,
        textAreaRef.current.selectionEnd,
        symbol
      ).join(""),
    });
  }

  function insertAtCursor(symbol: string) {
    if (!textAreaRef.current) return;
    const currentCursorPos = textAreaRef.current.selectionStart;

    setBody({
      ...body,
      [lang]: addAtIndex(body[lang].split(""), currentCursorPos, symbol).join(
        ""
      ),
    });
  }

  const toolbarOptions: {
    title: string;
    icon: JSX.Element;
    onClick?: () => void;
  }[][] = [
    [
      {
        title: t("articleEditor.write.toolbar.bold"),
        icon: <MaterialIcon icon="format_bold" />,
        onClick: () => wrapSelectionWith("**"),
      },
      {
        title: t("articleEditor.write.toolbar.italic"),
        icon: <MaterialIcon icon="format_italic" />,
        onClick: () => wrapSelectionWith("*"),
      },
      {
        title: t("articleEditor.write.toolbar.strikethrough"),
        icon: <MaterialIcon icon="format_strikethrough" />,
        onClick: () => wrapSelectionWith("~~"),
      },
      {
        title: t("articleEditor.write.toolbar.code"),
        icon: <MaterialIcon icon="code" />,
        onClick: () => wrapSelectionWith("`"),
      },
      {
        title: t("articleEditor.write.toolbar.headings"),
        icon: <MaterialIcon icon="format_size" />,
        onClick: () => {
          if (!textAreaRef.current) return;
          const currentStart = body[lang][textAreaRef.current?.selectionStart];
          if (currentStart == "#") insertAtCursor("#");
          else if (currentStart == "\n") insertAtCursor("\n\n## ");
          else insertAtCursor("## ");
        },
      },
    ],
    [
      {
        title: t("articleEditor.write.toolbar.quote"),
        icon: <MaterialIcon icon="format_quote" />,
        onClick: () => insertAtCursor("\n\n> "),
      },
      {
        title: t("articleEditor.write.toolbar.codeblock"),
        icon: <MaterialIcon icon="data_array" />,
        onClick: () => insertAtCursor("\n\n```\n\n```"),
      },
      {
        title: t("articleEditor.write.toolbar.table"),
        icon: <MaterialIcon icon="table" />,
        onClick: () =>
          insertAtCursor(
            "\n\n| A1 | B1 | C1 |\n| --- | --- | --- |\n| A2 | B2 | C2 |\n| A3 | B3 | C3 |"
          ),
      },
    ],
    [
      {
        title: t("articleEditor.write.toolbar.ul"),
        icon: <MaterialIcon icon="format_list_bulleted" />,
        onClick: () => insertAtCursor("\n\n- \n- \n- "),
      },
      {
        title: t("articleEditor.write.toolbar.ol"),
        icon: <MaterialIcon icon="format_list_numbered" />,
        onClick: () => insertAtCursor("\n\n1) \n2) \n3) "),
      },
    ],
    [
      {
        title: t("articleEditor.write.toolbar.photo"),
        icon: <MaterialIcon icon="photo" />,
        onClick: existingBody ? toggleShowAddImage : undefined,
      },
      {
        title: t("articleEditor.write.toolbar.link"),
        icon: <MaterialIcon icon="link" />,
        onClick: () => insertAtCursor("[Link](https://)"),
      },
    ],
  ];

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
        required
        value={lang}
      />

      {/* We don’t use `layout-grid-cols` here because otherwise Table would stretch the Preview side */}
      <div className="relative flex flex-col-reverse gap-y-4 gap-x-4 sm:flex-row md:gap-x-6">
        {/* Block editing English if not configured */}
        <BlockingPane
          icon={<MaterialIcon icon="translate" allowCustomSize />}
          text={t("articleEditor.write.enEditNotAllowed")}
          show={lang == "en-US" && allowEdit && !allowEditEN}
        />

        {/* Text area */}
        <section
          className="flex flex-col gap-2
            sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)]"
        >
          {/* Toolbar */}
          <div
            className="container-surface-variant scroll-desktop
              overflow-x-auto overflow-y-hidden rounded-lg"
          >
            <div className="flex flex-row divide-x divide-outline py-2">
              {toolbarOptions.map((group, idx) => (
                <div key={idx} className="flex flex-row gap-1 px-2">
                  {group.map((item) => (
                    <Button
                      key={item.title}
                      type="text"
                      name={item.title}
                      icon={item.icon}
                      iconOnly
                      disabled={!item.onClick}
                      onClick={item.onClick}
                      className={
                        item.onClick ? "!text-on-surface-variant" : undefined
                      }
                    />
                  ))}
                </div>
              ))}
              <div className="px-2">
                <LinkButton
                  name={t("articleEditor.write.toolbar.learnMD")}
                  type="text"
                  icon={<MaterialIcon icon="help" />}
                  iconOnly
                  url="https://www.markdownguide.org/basic-syntax/"
                  className="!text-on-surface-variant"
                  attr={{ target: "_blank", rel: "noreferrer" }}
                />
              </div>
            </div>
          </div>

          {/* Text area */}
          <div className="input textarea">
            <textarea
              key={`markdown-${lang}`}
              ref={textAreaRef}
              id="markdown"
              name="markdown"
              placeholder="Markdown"
              value={body[lang]}
              onChange={(e) => setBody({ ...body, [lang]: e.target.value })}
            />
            <label className="input__placeholder" htmlFor="markdown">
              {t("articleEditor.write.editorPlh")}
            </label>
          </div>
        </section>

        {/* Preview */}
        <section
          role="document"
          className="markdown h-fit rounded-lg border-outline !p-4 transition-[height]
            sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)]"
        >
          <h1 className="mb-2">
            {form[lang == "en-US" ? "titleEN" : "titleTH"]}
          </h1>
          <p className="mt-0 !font-display !text-lg">
            {form[lang == "en-US" ? "descEN" : "descTH"]}
          </p>
          {body ? (
            <Markdown noStyles>{body[lang]}</Markdown>
          ) : (
            <p className="container-surface-variant rounded p-4 text-center">
              {t("articleEditor.write.previewPlh")}
            </p>
          )}
        </section>
      </div>
      <Actions>
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

  // Dialog control
  const [showAddImage, toggleShowAddImage] = useReducer(
    (state: boolean) => !state,
    false
  );
  const [showDelete, toggleShowDelete] = useReducer(
    (state: boolean) => !state,
    false
  );

  // Form control
  const [form, setForm] = useState<Form>({
    titleTH: "",
    titleEN: "",
    descTH: "",
    descEN: "",
    bodyTH: "",
    bodyEN: "",
    image: null,
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
        image: null,
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
  function showPublishingFeedback(
    data: any,
    error: Partial<PostgrestError> | null
  ) {
    if (addToSnbQueue) {
      if (error)
        addToSnbQueue({
          id: "publish-error",
          text: t("error", { errorMsg: error.message || "unkown error" }),
        });
      else if (data) router.push("/t/admin/news");
    }
  }

  // Publish article
  async function handlePublish() {
    if (mode == "add") {
      const { data, error } = await createInfo(form);
      showPublishingFeedback(data, error);
    } else if (mode == "edit" && existingData) {
      const { data, error } = await updateInfo(existingData.id, form);
      showPublishingFeedback(data, error);
    }
  }

  // Delete article
  async function handleDelete() {
    if (existingData) {
      const error = await deleteInfo(existingData.id);
      if (addToSnbQueue && error)
        addToSnbQueue({
          id: "delete-error",
          text: t("error", { errorMsg: error.message }),
        });
      else {
        toggleShowDelete();
        router.push("/t/admin/news");
      }
    }
  }

  return (
    <>
      <ConfigSection
        existingData={existingData}
        form={form}
        setForm={setForm}
        onClickDelete={
          mode == "edit" && existingData ? toggleShowDelete : undefined
        }
      />
      <WriteSection
        existingBody={existingData?.content.body}
        form={form}
        setBody={(e) => setForm({ ...form, bodyTH: e.th, bodyEN: e["en-US"] })}
        toggleShowAddImage={toggleShowAddImage}
        allowEdit={validateConfig()}
        allowEditEN={evalAllowEditEN()}
        allowPublish={validate()}
        publish={handlePublish}
      />

      {/* Dialogs */}
      <div>
        <AddImageToNewsDialog
          show={showAddImage}
          onClose={toggleShowAddImage}
          fileDestination={
            existingData
              ? `/${existingData.type}/${existingData.id}`
              : "/uncategorized"
          }
        />
        <ConfirmDelete
          show={showDelete}
          onClose={toggleShowDelete}
          onSubmit={handleDelete}
        />
      </div>
    </>
  );
};

export default ArticleEditor;
