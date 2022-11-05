// External libraries
import { useTranslation } from "next-i18next";
import { MutableRefObject, useEffect, useRef, useState } from "react";

// SK Components
import {
  Button,
  ChipRadioGroup,
  Header,
  LinkButton,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Components
import BlockingPane from "@components/BlockingPane";
import Markdown from "@components/Markdown";

// Backend

// Types
import { LangCode, MultiLangString } from "@utils/types/common";

// Helpers
import { addAtIndex, wrapPartOfArray } from "@utils/helpers/array";

const ArticleWrite = ({
  existingBody,
  form,
  setBody: setExtBody,
  toggleShowAddImage,
}: {
  existingBody?: MultiLangString;
  form: {
    titleTH: string;
    titleEN: string;
    descTH: string;
    descEN: string;
  };
  setBody: (form: { th: string; "en-US": string }) => void;
  toggleShowAddImage?: () => void;
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
        onClick: () => insertAtCursor("\n\n1. \n2. \n3. "),
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
        show={!validateConfig()}
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
          show={lang == "en-US" && validateConfig() && !evalAllowEditEN()}
        />

        {/* Editor */}
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
              style={{ height: 420 }}
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
    </Section>
  );
};

export default ArticleWrite;
