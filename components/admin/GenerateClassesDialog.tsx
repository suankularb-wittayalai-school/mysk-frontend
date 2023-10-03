// Imports
import bulkCreateClassrooms from "@/utils/backend/classroom/bulkCreateClassrooms";
import { range } from "@/utils/helpers/array";
import { withLoading } from "@/utils/helpers/loading";
import useForm from "@/utils/helpers/useForm";
import { useToggle } from "@/utils/hooks/toggle";
import { DialogFC } from "@/utils/types/component";
import {
  Button,
  ChipSet,
  Columns,
  FullscreenDialog,
  InputChip,
  Section,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Trans, useTranslation } from "next-i18next";
import { useEffect } from "react";

/**
 * An interface to bulk generate classes with the number of classes each grade.
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when all classes are added to the database.
 *
 * @returns A Dialog.
 */
const GenerateClassesDialog: DialogFC<{
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("admin", {
    keyPrefix: "data.import.dialog.generateClasses",
  });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();

  // Form control
  const { form, setForm, formOK } = useForm<"numGrades" | "numClasses">([
    {
      key: "numGrades",
      defaultValue: 6,
      validate: (value: number) => value >= 0 && value <= 12,
    },
    {
      key: "numClasses",
      defaultValue: range(6).fill(0),
      validate: (value: number[]) =>
        !value.filter((value) => value < 1 || value > 15).length,
    },
  ]);

  // We are checking for the length of `numClasses` so as to preserve data
  // inside `numClasses` when changing the number of grades
  useEffect(
    () =>
      setForm((form) => ({
        ...form,
        numClasses:
          // Remove all grades if `numGrades` is less than 1
          form.numGrades < 1
            ? []
            : // If there are more grades in `numClasses` than we want, remove
            // the extra grades
            form.numGrades < form.numClasses.length
            ? form.numClasses.splice(-1 * form.numGrades)
            : // Else, add the missing grades
              // (Nothing will happen if the grades are already equal since we
              // would just concatenate an empty array)
              form.numClasses.concat(
                range(form.numGrades - form.numClasses.length).fill(0),
              ),
      })),
    [form.numGrades],
  );

  const [loading, toggleLoading] = useToggle();

  async function handleSubmit() {
    withLoading(async () => {
      if (!formOK) return false;
      await bulkCreateClassrooms(supabase, form.numClasses);
      onSubmit();
      return true;
    }, toggleLoading);
  }

  return (
    <FullscreenDialog
      open={open}
      title={t("title")}
      action={
        <Button
          appearance="text"
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          {t("action.generate")}
        </Button>
      }
      width={600}
      onClose={onClose}
    >
      <p>{t("desc")}</p>

      {/* Number of grades */}
      <Section>
        <Columns columns={2}>
          <TextField<string>
            appearance="outlined"
            label={t("numGrades")}
            value={String(form.numGrades)}
            onChange={(value) => setForm({ ...form, numGrades: Number(value) })}
            inputAttr={{ type: "number", min: 1, max: 12 }}
          />
        </Columns>
      </Section>

      {/* Number of classes per grade */}
      <Section
        element={(props) => (
          <section {...props} aria-labelledby="header-classes-per-grade" />
        )}
      >
        <h2 id="header-classes-per-grade" className="skc-title-large">
          {t("numClasses.title")}
        </h2>
        {/* Instructions */}
        <p>
          <Trans
            i18nKey="data.import.dialog.generateClasses.numClasses.instructions"
            ns="admin"
          >
            <span
              className="rounded-t-sm border-b-2 border-inverse-surface
                bg-surface-2 px-2 py-1 font-display text-on-surface"
            />
          </Trans>
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {range(
            // Limit number of inputs shown for performance reasons
            form.numGrades > 12 ? 12 : form.numGrades,
          ).map((grade) => (
            <TextField
              key={grade}
              appearance="outlined"
              label={t("numClasses.input", { grade: grade + 1 })}
              // Don’t show 0
              value={
                form.numClasses[grade] ? String(form.numClasses[grade]) : ""
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  numClasses: (form.numClasses as number[]).map(
                    (numClassesInGrade, index) =>
                      index === grade
                        ? // Limit number of classes shown for performance
                          // reasons
                          Math.min(Number(value), 15)
                        : numClassesInGrade,
                  ),
                })
              }
              inputAttr={{ type: "number", min: 1, max: 15 }}
            />
          ))}
        </div>
      </Section>

      {/* Preview */}
      {/* Only show the preview if `numClasses` is an array filled with 0s.
          The check works because 0 is falsy, and thus an array filled with 0s
          would become an empty array whose length is 0. */}
      {(form.numClasses as number[]).filter(
        (numClassesInGrade) => numClassesInGrade,
      ).length !== 0 ? (
        <Section
          element={(props) => (
            <section {...props} aria-labelledby="header-preview" />
          )}
        >
          <h2 id="header-preview" className="skc-title-large">
            {t("preview.title")}
          </h2>
          <ChipSet>
            {/* Loop through `numClasses`, where the value is the number of
                classes and the index is the grade (counting from zero) */}
            {(form.numClasses as number[]).map((value, index) =>
              range(value).map((classSuffix) => {
                const classNumber = [
                  index + 1,
                  (classSuffix + 1).toString().padStart(2, "0"),
                ].join("");
                return (
                  <InputChip key={classNumber}>
                    {tx("class", { number: classNumber })}
                  </InputChip>
                );
              }),
            )}
          </ChipSet>
        </Section>
      ) : (
        <></>
      )}
    </FullscreenDialog>
  );
};

export default GenerateClassesDialog;
