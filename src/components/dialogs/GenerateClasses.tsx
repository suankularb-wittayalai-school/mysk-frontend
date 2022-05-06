import {
  Chip,
  ChipList,
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";
import { range } from "@utils/helpers/array";
import { DialogProps } from "@utils/types/common";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const GenerateClassesDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: () => void }): JSX.Element => {
  const { t } = useTranslation(["admin", "common"]);

  // Form control
  const [numGrades, setNumGrades] = useState<number>(6);
  const [numClasses, setNumClasses] = useState<Array<number>>(
    range(6).map(() => 0)
  );

  // (@SiravitPhokeed)
  // We are checking for the length of numClasses so as to preserve data inside numClasses
  // when changing the number of grades
  useEffect(
    () =>
      setNumClasses((numClasses) =>
        // If there are more grades in numClasses than we want, remove the extra grades
        numClasses.length < numGrades
          ? numClasses.splice(-1 * numGrades)
          : // Else, add the missing grades
            // (Nothing will happen if the grades are already equal since we would just
            // concatenate an empty array)
            [
              ...numClasses,
              ...range(numGrades - numClasses.length).map(() => 0),
            ]
      ),
    [numGrades]
  );

  useEffect(() => setNumClasses(range(6).map(() => 0)), [show]);

  return (
    <Dialog
      type="large"
      label="generate-classes"
      title="Generate classes"
      supportingText="Automatically generate a whole academic year of classes with this tool."
      show={show}
      actions={[
        { name: "Cancel", type: "close" },
        { name: "Generate", type: "submit" },
      ]}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <DialogSection name="num-grades" isDoubleColumn>
        <KeyboardInput
          name="num-grades"
          type="number"
          label="Number of grades"
          onChange={(e) => setNumGrades(Number(e))}
          defaultValue={6}
        />
      </DialogSection>
      <DialogSection name="num-classes">
        <p>
          Enter the amount of classes you would like in each grade. For example,
          if you want the classes{" "}
          <code className="rounded-sm bg-surface-2 py-1 px-2">
            M.101, M.102, M.103
          </code>
          , enter “3” inside the field labeled “M.1”.
        </p>
        <div className="grid grid-cols-2 gap-x-6">
          {range(numGrades).map((grade) => {
            return (
              <KeyboardInput
                key={grade}
                name={`m-${grade + 1}`}
                type="number"
                label={t("class", { ns: "common", number: grade + 1 })}
                onChange={(e) => {
                  setNumClasses(
                    numClasses.map((numClassesInGrade, index) =>
                      index == grade ? Number(e) : numClassesInGrade
                    )
                  );
                }}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="!text-base">Preview</h3>
          <div className="sm:h-24 sm:resize-y sm:overflow-y-scroll">
            <ChipList>
              {numClasses.map((numClassesInGrade, index) =>
                range(numClassesInGrade).map((classSuffix) => {
                  const classNumber = `${index + 1}${(classSuffix + 1)
                    .toString()
                    .padStart(2, "0")}`;
                  return (
                    <Chip
                      key={classNumber}
                      name={t("class", { ns: "common", number: classNumber })}
                    />
                  );
                })
              )}
            </ChipList>
          </div>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default GenerateClassesDialog;
