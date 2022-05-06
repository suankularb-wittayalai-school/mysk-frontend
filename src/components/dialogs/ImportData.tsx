// SK Components
import { Dialog, DialogSection, FileInput } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

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
  return (
    <Dialog
      type="large"
      label="import-data"
      title="Import data"
      actions={[
        { name: "Cancel", type: "close" },
        { name: "Import", type: "submit" },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <DialogSection name="info">
        <h2 className="sr-only">Columns</h2>
        <p>Please ensure your data has these columns:</p>
        <div
          className="h-32 resize-y overflow-y-scroll rounded-t-sm
            border-b-2 border-inverse-surface bg-surface-2 p-2 text-on-surface"
        >
          <div className="flex flex-col leading-snug">
            {columns.length > 0
              ? columns.map((column) => (
                  <div
                    key={column.name}
                    className={
                      column.optional ? "text-on-surface-variant" : undefined
                    }
                  >
                    <h3 className="inline !text-base">
                      {column.name}
                      {column.optional && (
                        <span className="text-tertiary">?</span>
                      )}
                      {": "}
                    </h3>
                    <span className="text-sm">{column.type}</span>
                  </div>
                ))
              : "No column data. Please use your code senses."}
          </div>
        </div>
      </DialogSection>

      <DialogSection name="upload" title="Upload" className="!gap-2">
        <div className="sm:grid sm:grid-cols-2 sm:gap-x-6">
          <FileInput
            name="file"
            label="File"
            helperMsg="Accepts CSV."
            attr={{ accept: ".csv" }}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default ImportDataDialog;
