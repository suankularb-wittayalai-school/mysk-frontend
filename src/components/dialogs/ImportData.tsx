// SK Components
import { Dialog, DialogSection, FileInput } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const ImportDataDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: () => void }): JSX.Element => {
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
        <div className="h-32 resize-y overflow-y-scroll rounded-t-sm border-b-2 bg-surface-2 p-2 text-on-surface">
          <div className="flex flex-col leading-snug">
            <div>
              <h3 className="inline !text-base">prefix_en: </h3>
              <span className="text-sm">
                &quot;Master&quot; | &quot;Mr.&quot; | &quot;Mrs.&quot; |
                &quot;Miss.&quot;
              </span>
            </div>
            <div>
              <h3 className="inline !text-base">prefix_th: </h3>
              <span className="text-sm">
                &quot;เด็กชาย&quot; | &quot;นาย&quot; | &quot;นาง&quot; |
                &quot;นางสาว&quot;
              </span>
            </div>
            <div>
              <h3 className="inline !text-base">first_name_th: </h3>
              <span className="text-sm">text</span>
            </div>
            <div>
              <h3 className="inline !text-base">first_name_en: </h3>
              <span className="text-sm">text</span>
            </div>
            <div className="text-on-surface-variant">
              <h3 className="inline !text-base">
                middle_name_en<span className="text-tertiary">?</span>:{" "}
              </h3>
              <span className="text-sm">text</span>
            </div>
            <div className="text-on-surface-variant">
              <h3 className="inline !text-base">
                middle_name_en<span className="text-tertiary">?</span>:{" "}
              </h3>
              <span className="text-sm">text</span>
            </div>
            <div>
              <h3 className="inline !text-base">last_name_en: </h3>
              <span className="text-sm">text</span>
            </div>
            <div>
              <h3 className="inline !text-base">last_name_en: </h3>
              <span className="text-sm">text</span>
            </div>
          </div>
        </div>
      </DialogSection>

      <DialogSection
        name="upload"
        title="Upload"
        isDoubleColumn
        className="!gap-2"
      >
        <FileInput
          name="file"
          label="File"
          helperMsg="Accepts CSV."
          attr={{ accept: ".csv" }}
        />
      </DialogSection>
    </Dialog>
  );
};

export default ImportDataDialog;
