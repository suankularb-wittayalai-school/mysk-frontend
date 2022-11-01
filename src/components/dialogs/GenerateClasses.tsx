// Modules
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Chip,
  ChipList,
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Backend
import { createClassroom } from "@utils/backend/classroom/classroom";

// Helpers
import { range } from "@utils/helpers/array";
import { getCurrentAcademicYear } from "@utils/helpers/date";

// Types
import { Class } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";

const GenerateClassesDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: () => void }): JSX.Element => {
  const { t } = useTranslation(["admin", "common"]);

  // Form control
  const [numGrades, setNumGrades] = useState<number>(6);
  const [numClasses, setNumClasses] = useState<Array<number>>(range(6).fill(0));

  // We are checking for the length of `numClasses` so as to preserve data inside `numClasses`
  // when changing the number of grades
  useEffect(
    () =>
      setNumClasses((numClasses) =>
        // Remove all grades if `numGrades` is less than 1
        numGrades < 1
          ? []
          : // If there are more grades in `numClasses` than we want, remove the extra grades
          numGrades < numClasses.length
          ? numClasses.splice(-1 * numGrades)
          : // Else, add the missing grades
            // (Nothing will happen if the grades are already equal since we would just
            // concatenate an empty array)
            numClasses.concat(range(numGrades - numClasses.length).fill(0))
      ),
    [numGrades]
  );

  // Form reset
  useEffect(() => setNumClasses(range(6).fill(0)), [show]);

  function validate(): boolean {
    if (numGrades < 0 || numGrades > 12) return false;
    if (numClasses.filter((value) => value < 1 || value > 15).length)
      return false;

    return true;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    // create range of class for each year based on numClasses and numGrades and flatten it to an array
    const classes: Class[] = range(numGrades)
      .map((grade, index) => {
        const classesForGrade: Class[] = range(numClasses[index]).map(
          (classNum) => ({
            id: 0,
            number: (index + 1) * 100 + (classNum + 1),
            year: getCurrentAcademicYear(),
            students: [],
            classAdvisors: [],
            schedule: {
              id: 0,
              content: [],
            },
            contacts: [],
            subjects: [],
          })
        );
        return classesForGrade;
      })
      .flat();

    await Promise.all(
      classes.map(async (classItem) => await createClassroom(classItem))
    );

    onSubmit();
  }

  return (
    <Dialog
      type="large"
      label="generate-classes"
      title={t("dialog.generateClasses.title")}
      supportingText={t("dialog.generateClasses.supportingText")}
      show={show}
      actions={[
        {
          name: t("dialog.generateClasses.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.generateClasses.action.generate"),
          type: "submit",
          disabled: !validate(),
        },
      ]}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* Number of grades */}
      <DialogSection name="num-grades" isDoubleColumn>
        <KeyboardInput
          name="num-grades"
          type="number"
          label={t("dialog.generateClasses.numGrades")}
          onChange={(e) => setNumGrades(Number(e))}
          defaultValue={6}
          attr={{ min: 1, max: 12 }}
        />
      </DialogSection>

      {/* Number of classes per grade */}
      <DialogSection
        name="num-classes"
        title={t("dialog.generateClasses.numClasses.title")}
      >
        {/* Instructions */}
        <p>
          <Trans
            i18nKey="dialog.generateClasses.numClasses.instructions"
            ns="admin"
          >
            Enter the amount of classes you would like in each grade. For
            example, if you want the classes
            <span
              className="rounded-t-sm border-b-2 border-inverse-surface bg-surface-2
                py-1 px-2 font-display text-on-surface"
            >
              M.101, M.102, M.103
            </span>
            , enter “3” inside the field labeled “M.1”.
          </Trans>
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-x-6">
          {range(
            // Limit number of inputs shown for performance reasons
            numGrades > 12 ? 12 : numGrades
          ).map((grade) => {
            return (
              <KeyboardInput
                key={grade}
                name={`m-${grade + 1}`}
                type="number"
                label={t("dialog.generateClasses.numClasses.input", {
                  grade: grade + 1,
                })}
                onChange={(e) => {
                  const parsedE = Number(e);
                  setNumClasses(
                    numClasses.map((numClassesInGrade, index) =>
                      index == grade
                        ? // Limit number of classes shown for performance reasons
                          parsedE > 15
                          ? 15
                          : parsedE
                        : numClassesInGrade
                    )
                  );
                }}
                attr={{ min: 1, max: 15 }}
              />
            );
          })}
        </div>
      </DialogSection>

      {/* Preview */}
      {
        // Only show the preview if `numClasses` is an array filled with 0s.
        // The check works because 0 is falsy, and thus an array filled with 0s would become an empty
        // array whose length is 0.
        numClasses.filter((numClassesInGrade) => numClassesInGrade).length !=
          0 && (
          <DialogSection
            name="preview"
            title={t("dialog.generateClasses.preview")}
          >
            <div className="sm:h-24 sm:resize-y sm:overflow-y-scroll sm:pr-2">
              <ChipList>
                {
                  // Loops through `numClasses`, where the value is the number of classes
                  // and the index is the grade (counting from zero)
                  numClasses.map((value, index) =>
                    range(value).map((classSuffix) => {
                      const classNumber = `${index + 1}${(classSuffix + 1)
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <Chip
                          key={classNumber}
                          name={t("class", {
                            ns: "common",
                            number: classNumber,
                          })}
                        />
                      );
                    })
                  )
                }
              </ChipList>
            </div>
          </DialogSection>
        )
      }
    </Dialog>
  );
};

export default GenerateClassesDialog;
