// External libraries
import { AnimatePresence, LayoutGroup, motion, Reorder } from "framer-motion";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Dropdown,
  Header,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Components
import FormField from "@components/news/FormField";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { FieldType, FormField as FormFieldType } from "@utils/types/news";
import { LangCode } from "@utils/types/common";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

const fieldTypeMap = {
  short_answer: "shortAnswer",
  paragraph: "paragraph",
  multiple_choice: "multipleChoice",
  check_box: "checkBox",
  dropdown: "dropdown",
  file: "file",
  date: "date",
  time: "time",
  scale: "scale",
};

const AddToForm = ({
  addToFields,
}: {
  addToFields: (field: FormFieldType) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  const [type, setType] = useState<FieldType>("short_answer");

  // Note: this ID won’t be used in Supabase. This is purely for keeping track of
  // fields client-side.
  const [latestID, incrementID] = useReducer((value) => value + 1, 0);

  return (
    <Section>
      <Card type="stacked" appearance="outlined" className="!overflow-visible">
        <CardHeader
          icon={<MaterialIcon icon="add_circle" />}
          title={<h3>{t("articleEditor.form.add.title")}</h3>}
        />
        <LayoutGridCols cols={3}>
          <Dropdown
            name="type"
            label={t("articleEditor.form.add.type")}
            options={(
              [
                "short_answer",
                "paragraph",
                "multiple_choice",
                "check_box",
                "dropdown",
                "file",
                "date",
                "time",
                "scale",
              ] as FieldType[]
            ).map((fieldType) => ({
              value: fieldType,
              label: t(`articleEditor.form.field.${fieldTypeMap[fieldType]}`),
            }))}
            onChange={setType}
            className="ml-4 mt-4"
          />
        </LayoutGridCols>
        <CardActions className="!pt-0">
          <Button
            type="filled"
            label={t("articleEditor.form.add.action.add")}
            onClick={() => {
              addToFields({
                id: latestID,
                label: {
                  th: "คำถามที่ไม่มีชื่อ",
                  "en-US": locale == "en-US" ? "Untitled question" : undefined,
                },
                type,
                required: false,
                // Have empty array in options if needed
                options: ["check_box", "dropdown", "multiple_choice"].includes(
                  type
                )
                  ? []
                  : undefined,
                // Set default range if needed
                range: type == "scale" ? { start: 1, end: 5 } : undefined,
              });
              incrementID();
            }}
          />
        </CardActions>
      </Card>
    </Section>
  );
};

const FieldList = ({
  fields,
  setFields,
}: {
  fields: FormFieldType[];
  setFields: (fields: FormFieldType[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  function updateFieldAttr(id: number, attr: keyof FormFieldType, value: any) {
    setFields(
      fields.map((item) => (id == item.id ? { ...item, [attr]: value } : item))
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={fields}
      onReorder={setFields}
      className="flex flex-col gap-2 md:col-span-2"
    >
      <AnimatePresence>
        {fields.map((field) => (
          <Reorder.Item
            key={field.id}
            value={field}
            initial={{ y: -10, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.8, opacity: 0 }}
            transition={animationTransition}
            className="cursor-move"
          >
            <Card
              type="stacked"
              appearance="tonal"
              className="!overflow-visible"
            >
              <CardHeader
                title={<h3>{getLocaleString(field.label, locale)}</h3>}
                label={t(
                  `articleEditor.form.field.${fieldTypeMap[field.type]}`
                )}
                end={
                  <Actions>
                    <Button
                      name={t("articleEditor.form.list.action.delete")}
                      type="text"
                      icon={<MaterialIcon icon="delete" />}
                      iconOnly
                      onClick={() =>
                        setFields(fields.filter((item) => field.id != item.id))
                      }
                    />
                    <MaterialIcon icon="drag_indicator" />
                  </Actions>
                }
              />
              <CardSupportingText>
                <div className="layout-grid-cols-4 !gap-y-0">
                  {/* Local label (Thai) */}
                  <KeyboardInput
                    name="label-th"
                    type="text"
                    label={t("articleEditor.form.list.labelTH")}
                    onChange={(e) =>
                      updateFieldAttr(field.id, "label", {
                        ...field.label,
                        th: e,
                      })
                    }
                    defaultValue={field.label.th}
                  />
                  {/* English label */}
                  <KeyboardInput
                    name="label-en"
                    type="text"
                    label={t("articleEditor.form.list.labelEN")}
                    onChange={(e) =>
                      updateFieldAttr(field.id, "label", {
                        ...field.label,
                        "en-US": e,
                      })
                    }
                    defaultValue={field.label["en-US"]}
                  />
                  {field.type == "scale" && (
                    <>
                      <KeyboardInput
                        name="range-start"
                        type="number"
                        label={t("articleEditor.form.list.rangeStart")}
                        onChange={(e) =>
                          updateFieldAttr(field.id, "range", {
                            ...field.range,
                            start: e,
                          })
                        }
                        defaultValue={field.range?.start}
                      />
                      <KeyboardInput
                        name="range-end"
                        type="number"
                        label={t("articleEditor.form.list.rangeEnd")}
                        onChange={(e) =>
                          updateFieldAttr(field.id, "range", {
                            ...field.range,
                            end: e,
                          })
                        }
                        defaultValue={field.range?.end}
                      />
                    </>
                  )}
                  {field.type != "file" &&
                    (field.type == "scale" ? (
                      <KeyboardInput
                        name="default"
                        type="number"
                        label={t("articleEditor.form.list.default")}
                        onChange={(e) =>
                          updateFieldAttr(field.id, "default", e)
                        }
                        attr={{
                          min: field.range?.start,
                          max: field.range?.end,
                        }}
                      />
                    ) : (
                      <FormField
                        field={{
                          ...field,
                          label: { th: t("articleEditor.form.list.default") },
                          options: field.options || [],
                        }}
                        onChange={(e) =>
                          updateFieldAttr(field.id, "default", e)
                        }
                        className={
                          field.type == "paragraph" ? "col-span-2" : undefined
                        }
                      />
                    ))}
                </div>
              </CardSupportingText>
            </Card>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

const FormPreview = ({ fields }: { fields: FormFieldType[] }): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Card type="stacked" appearance="outlined" className="h-fit">
      <CardHeader
        icon={<MaterialIcon icon="preview" />}
        title={<h3>{t("articleEditor.form.preview")}</h3>}
      />
      <CardSupportingText className="!gap-0">
        <LayoutGroup>
          <AnimatePresence>
            {fields.map((field) => (
              <motion.div
                key={field.id}
                layoutId={["preview", field.id].join("-")}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={animationTransition}
              >
                <FormField
                  field={{ ...field, options: field.options || [] }}
                  onChange={() => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </CardSupportingText>
    </Card>
  );
};

const ArticleForm = ({
  mode,
  setFields: setExtFields,
}: {
  mode: "add" | "edit";
  setFields: (incFields: Omit<FormFieldType, "id">[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [fields, setFields] = useState<FormFieldType[]>([]);
  useEffect(() => setExtFields(fields), [fields]);

  return (
    <Section className="!gap-y-6">
      <Header
        icon={<MaterialIcon icon="checklist" allowCustomSize />}
        text={t("articleEditor.form.title")}
      />

      <AddToForm addToFields={(field) => setFields([field, ...fields])} />

      <div className="layout-grid-cols-3 !flex-col-reverse">
        {/* Field list */}
        <FieldList fields={fields} setFields={setFields} />

        {/* Form preview */}
        <AnimatePresence>
          {fields.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={animationTransition}
            >
              <FormPreview fields={fields} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-2"></div>
    </Section>
  );
};

export default ArticleForm;
