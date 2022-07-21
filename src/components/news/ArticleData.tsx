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
      <LayoutGridCols cols={3}>
        <Card type="stacked" appearance="outlined">
          <CardHeader
            icon={<MaterialIcon icon="folder_open" />}
            title={<h3>Import spreadsheet</h3>}
            label={<span>Display a file as a table</span>}
          />
          <CardSupportingText>
            <p>
              Use a .csv or a .xlsx file as data to be displayed to the user.
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
            <TextArea name="markdown" label="Markdown" onChange={() => {}} />
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
  );
};

export default ArticleData;
