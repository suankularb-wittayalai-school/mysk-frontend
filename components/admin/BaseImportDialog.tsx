// Imports
import SnackbarContext from "@/contexts/SnackbarContext";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { DialogFC } from "@/utils/types/component";
import {
  Actions,
  Button,
  Card,
  Columns,
  FullscreenDialog,
  MaterialIcon,
  Section,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@suankularb-components/react";
import { parse } from "csv-parse";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * The base component for a Data Import Dialog, a processed reserved for
 * admins. A Base Import Dialog can be specialized for a table in the database
 * via `title` and `columns`. Then, it can be
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the input CSV file finishes being parsed.
 * @param title The title text.
 * @param columns Information about the columns in the CSV file.
 *
 * @returns A Full-screen Dialog.
 */
const BaseImportDialog: DialogFC<{
  title: string;
  columns: { name: string; type: string; optional?: boolean }[];
  onSubmit: (csvData: any) => any;
}> = ({ open, onClose, onSubmit, title, columns }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", {
    keyPrefix: "data.import.dialog.import",
  });
  const { t: tx } = useTranslation(["common", "admin"]);

  const { setSnackbar } = useContext(SnackbarContext);

  const { form, setForm, formOK, formProps } = useForm<"csvFile" | "hasHeader">(
    [
      {
        key: "csvFile",
        required: true,
        validate: (value: File) => /.csv$/.test(value.name),
      },
      { key: "hasHeader", defaultValue: true },
    ],
  );

  /**
   * Validate, parse, and pass the CSV data onto `onSubmit`.
   */
  async function handleSubmit() {
    // Validate the form
    if (!formOK) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }

    // Load the CSV file
    const fileContent: string | ArrayBuffer = await new Promise(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) =>
          event.target?.result ? resolve(event.target.result) : reject();
        reader.onerror = (event) => reject(event);
        reader.readAsText(form.csvFile);
      },
    );

    if (!fileContent) return;
    if (typeof fileContent !== "string") return;

    // Parse the CSV file and pass it to `onSubmit`
    parse(
      fileContent,
      {
        columns: columns.map((column) => column.name),
        delimiter: ",",
        skip_empty_lines: true,
        cast: true,
        relax_column_count: true,
        trim: true,
        from: form.hasHeader ? 2 : 1,
      },
      (err, result) => {
        // Error handling
        if (err) {
          console.error(err);
          setSnackbar(
            <Snackbar
              action={
                <Button appearance="text" onClick={handleSubmit}>
                  {tx("snackbar.common.action.retry")}
                </Button>
              }
            >
              {tx("snackbar.failure")}
            </Snackbar>,
          );
          return;
        }

        // Pass the parsed data onto `onSubmit`
        onSubmit(result);
        return;
      },
    );
  }

  /**
   * Creates and downloads the starter CSV file.
   */
  async function handleDownload() {
    const csvFile = new Blob(
      [columns.map((column) => column.name).join() + "\n"],
      { type: "text/csv" },
    );
    window.location.href = URL.createObjectURL(csvFile);
    setSnackbar(<Snackbar>The CSV file will be downloaded soon</Snackbar>);
  }

  return (
    <FullscreenDialog
      open={open}
      title={title}
      action={
        <Button appearance="text" onClick={handleSubmit}>
          {t("action.import")}
        </Button>
      }
      width={600}
      onClose={onClose}
      className="[&_.skc-fullscreen-dialog\_\_content]:!gap-6"
    >
      <Section>
        <p className="skc-body-medium">{t("desc")}</p>
        <Table contentWidth={600} className="sm:h-96 sm:resize-y">
          <TableHead fixed>
            <TableRow>
              <TableCell header className="w-4/12">
                {t("table.header")}
              </TableCell>
              <TableCell header className="w-6/12">
                {t("table.contentType")}
              </TableCell>
              <TableCell header className="w-2/12">
                {t("table.required")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((column) => (
              <TableRow
                key={column.name}
                className={
                  column.optional ? "italic [&_*]:!font-light" : undefined
                }
              >
                <TableCell
                  header
                  align="left"
                  className="!bg-surface-1 !font-mono"
                >
                  {column.name}
                </TableCell>
                <TableCell align="left" className="!font-mono">
                  {column.type}
                </TableCell>
                <TableCell className="[&_.skc-table-cell\_\_content]:!pr-3">
                  {column.optional ? (
                    <MaterialIcon icon="close" />
                  ) : (
                    <MaterialIcon icon="check" className="!text-on-surface" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section>
        <Actions align="left">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="download" />}
            onClick={handleDownload}
          >
            {t("action.downloadStarter")}
          </Button>
        </Actions>
      </Section>

      <Section>
        <Columns columns={2} className="!items-stretch">
          <TextField<File>
            appearance="filled"
            label={t("form.csvFile")}
            trailing={<MaterialIcon icon="attach_file" />}
            locale={locale}
            inputAttr={{ type: "file", accept: ".csv" }}
            {...formProps.csvFile}
          />
          <Card
            appearance="filled"
            direction="row"
            className="items-center gap-2 px-4 py-3"
          >
            <label htmlFor="switch-has-header" className="skc-title-small grow">
              {tx("form.hasHeader", { ns: "admin" })}
            </label>
            <Switch
              value={form.hasHeader}
              onChange={(hasHeader) => setForm({ ...form, hasHeader })}
              buttonAttr={{ id: "switch-has-header" }}
            />
          </Card>
        </Columns>
      </Section>
    </FullscreenDialog>
  );
};

export default BaseImportDialog;
