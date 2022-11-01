// External libraries
import { useState } from "react";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  FileInput,
  Header,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  Section,
  TextArea,
} from "@suankularb-components/react";

// Components
import Markdown from "@components/Markdown";

// Utils
import { mdTableRegex } from "@utils/patterns";

const CreateTable = (): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [form, setForm] = useState<{
    spreadsheetFile: File | null;
    markdown: string;
    formLink: string;
  }>({
    spreadsheetFile: null,
    markdown: "",
    formLink: "",
  });

  return (
    <section>
      <Card type="stacked" appearance="tonal">
        <CardHeader
          icon={<MaterialIcon icon="add_circle" />}
          title={<h3>{t("articleEditor.data.create.title")}</h3>}
        />

        <CardSupportingText>
          <LayoutGridCols cols={3}>
            {/* Import spreadsheet */}
            <Card type="stacked" appearance="tonal" className="!bg-surface">
              <CardHeader
                icon={<MaterialIcon icon="folder_open" />}
                title={
                  <h4>{t("articleEditor.data.create.importFile.title")}</h4>
                }
                label={
                  <span>
                    {t("articleEditor.data.create.importFile.subtitle")}
                  </span>
                }
              />
              <CardSupportingText>
                <p>
                  {t("articleEditor.data.create.importFile.supportingText")}
                </p>
                <FileInput
                  name="spreadsheet-file"
                  label={t(
                    "articleEditor.data.create.importFile.spreadsheetFile"
                  )}
                  noneAttachedMsg={t("input.none.noFilesAttached", {
                    ns: "common",
                  })}
                  onChange={(e) => setForm({ ...form, spreadsheetFile: e })}
                  attr={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  }}
                />
              </CardSupportingText>
            </Card>

            {/* Create Markdown table */}
            <Card type="stacked" appearance="tonal" className="!bg-surface">
              <CardHeader
                icon={<MaterialIcon icon="edit_square" />}
                title={
                  <h4>{t("articleEditor.data.create.createMDTable.title")}</h4>
                }
                label={
                  <span>
                    {t("articleEditor.data.create.createMDTable.subtitle")}
                  </span>
                }
              />
              <CardSupportingText>
                <TextArea
                  name="markdown"
                  label={t(
                    "articleEditor.data.create.createMDTable.mdTextareaPlh"
                  )}
                  onChange={(e) => setForm({ ...form, markdown: e })}
                />
                <Markdown noStyles>
                  {form.markdown.match(mdTableRegex) ? form.markdown : ""}
                </Markdown>
              </CardSupportingText>
            </Card>

            {/* Link form */}
            <Card type="stacked" appearance="tonal" className="!bg-surface">
              <CardHeader
                icon={<MaterialIcon icon="link" />}
                title={<h4>{t("articleEditor.data.create.linkForm.title")}</h4>}
                label={
                  <span>
                    {t("articleEditor.data.create.linkForm.subtitle")}
                  </span>
                }
              />
              <CardSupportingText>
                <p>{t("articleEditor.data.create.linkForm.supportingText")}</p>
                <KeyboardInput
                  name="form-link"
                  type="url"
                  label={t("articleEditor.data.create.linkForm.formLink")}
                  helperMsg={t(
                    "articleEditor.data.create.linkForm.formLink_helper"
                  )}
                  onChange={(e) => setForm({ ...form, formLink: e })}
                  attr={{
                    pattern: "https://mysk.school/news/form/\\d+",
                    disabled: true,
                  }}
                />
              </CardSupportingText>
            </Card>
          </LayoutGridCols>
        </CardSupportingText>
        <CardActions>
          <Button
            type="filled"
            icon={<MaterialIcon icon="magic_button" />}
            label={t("articleEditor.data.create.action.create")}
            disabled
          />
        </CardActions>
      </Card>
    </section>
  );
};

const ArticleData = (): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="table" allowCustomSize />}
        text={t("articleEditor.data.title")}
      />
      <CreateTable />
    </Section>
  );
};

export default ArticleData;
