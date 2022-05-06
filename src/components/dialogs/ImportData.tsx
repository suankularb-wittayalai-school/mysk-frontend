// SK Components
import {
  Dialog,
  DialogSection,
  FileInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { useEffect, useState } from "react";

const ImportDataDialog = ({
  show,
  onClose,
  onSubmit,
  columns,
}: DialogProps & {
  onSubmit: () => void;
  columns: {
    name: string;
    type: string;
    optional?: boolean;
  }[];
}): JSX.Element => {
  const [csvFile, setCSVFile] = useState<File | null>();

  function validate(): boolean {
    // Check if file exists
    if (!csvFile) return false;

    // Check if file type is CSV
    if (!csvFile.name.match(/.csv$/)) return false;

    return true;
  }

  useEffect(() => setCSVFile(null), [show]);

  return (
    <Dialog
      type="large"
      label="import-data"
      title="Import data"
      actions={[
        { name: "Cancel", type: "close" },
        { name: "Import", type: "submit", disabled: !validate() },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <DialogSection name="columns">
        <h2 className="sr-only">Columns</h2>
        <p>
          You can import a CSV file to the MySK database. Please ensure that the
          columns in your CSV file match the following exactly.
        </p>
        <p className="flex flex-row flex-wrap items-center gap-x-1">
          <span className="font-display">Note:</span>
          <div className="text-xl text-tertiary">
            <MaterialIcon icon="help_outline" allowCustomSize />
          </div>
          means optional.
        </p>
        <div
          className="mb-4 h-72 resize-y overflow-y-scroll rounded-t-sm
            border-b-2 border-inverse-surface bg-surface-2
            p-2 text-on-surface sm:h-40"
        >
          <div>
            {columns.length > 0
              ? columns.map((column) => (
                  <div
                    key={column.name}
                    className="flex flex-row items-center gap-1"
                  >
                    {column.optional && (
                      <div className="text-xl text-tertiary">
                        <MaterialIcon icon="help_outline" allowCustomSize />
                      </div>
                    )}
                    <h3 className="inline !text-base">{column.name}:</h3>
                    <span className="text-sm">{column.type}</span>
                  </div>
                ))
              : "No column data. Please use your code senses."}
          </div>
        </div>
      </DialogSection>

      <DialogSection name="upload" title="Upload file">
        <div className="sm:grid sm:grid-cols-2 sm:gap-x-6">
          <FileInput
            name="file"
            label="File"
            onChange={(e) => setCSVFile(e)}
            attr={{ accept: ".csv, text/csv" }}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default ImportDataDialog;
