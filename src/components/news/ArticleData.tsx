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

const ArticleData = (): JSX.Element => {
  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="table" allowCustomSize />}
        text="Data"
      />
      <div>
        <Card type="stacked" appearance="tonal">
          <CardHeader
            icon={<MaterialIcon icon="add_circle" />}
            title={<h3>Create new table</h3>}
          />

          <CardSupportingText>
            <LayoutGridCols cols={3}>
              {/* Import spreadsheet */}
              <Card type="stacked" appearance="tonal" className="!bg-surface">
                <CardHeader
                  icon={<MaterialIcon icon="folder_open" />}
                  title={<h4>Import spreadsheet</h4>}
                  label={<span>Display a file as a table</span>}
                />
                <CardSupportingText>
                  <p>
                    Use a .csv or a .xlsx file as data to be displayed to the
                    user.
                  </p>
                  <FileInput
                    name="spreadsheet-file"
                    label="Spreadsheet file"
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
                  title={<h4>Create Markdown table</h4>}
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

              {/* Link form */}
              <Card type="stacked" appearance="tonal" className="!bg-surface">
                <CardHeader
                  icon={<MaterialIcon icon="link" />}
                  title={<h4>Link form</h4>}
                  label={<span>Tally student responses</span>}
                />
                <CardSupportingText>
                  <p>
                    Enter the link to the form from which you’d like to tally
                    the student responses. We only support forms made in MySK.
                  </p>
                  <KeyboardInput
                    name="form-link"
                    type="url"
                    label="Form link"
                    helperMsg="Starts with “https://mysk.school/news/form/”."
                    onChange={() => {}}
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
              label="Create table"
            />
          </CardActions>
        </Card>
      </div>
    </Section>
  );
};

export default ArticleData;
