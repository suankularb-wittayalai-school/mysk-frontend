// External libraries
import { AnimatePresence, Reorder } from "framer-motion";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  CardSupportingText,
  Dropdown,
  Header,
  KeyboardInput,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { FieldType, FormField } from "@utils/types/news";
import { LangCode } from "@utils/types/common";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

const FieldList = ({
  fields,
  setFields,
}: {
  fields: FormField[];
  setFields: (fields: FormField[]) => void;
}): JSX.Element => {
  const locale = useRouter().locale as LangCode;

  function updateFieldAttr(id: number, attr: keyof FormField, value: any) {
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
                label={<code>{field.type}</code>}
                end={
                  <Actions>
                    <Button
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
                  {/* Type */}
                  <Dropdown
                    name="type"
                    label="Type"
                    options={
                      [
                        { value: "short_answer", label: "Short answer" },
                        { value: "paragraph", label: "Paragraph" },
                        {
                          value: "multiple_choice",
                          label: "Multiple choice",
                        },
                        { value: "check_box", label: "Checkbox list" },
                        { value: "dropdown", label: "Dropdown" },
                        { value: "file", label: "File upload" },
                        { value: "date", label: "Date" },
                        { value: "time", label: "Time" },
                        { value: "scale", label: "Scale" },
                      ] as { value: FieldType; label: string }[]
                    }
                    onChange={(e: FieldType) =>
                      updateFieldAttr(field.id, "type", e)
                    }
                    defaultValue={field.type}
                  />
                  {/* Local label (Thai) */}
                  <KeyboardInput
                    name="label-th"
                    type="text"
                    label="Local label (Thai)"
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
                    label="English label"
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
                        label="Range start"
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
                        label="Range end"
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
                  <KeyboardInput
                    name="default"
                    type="text"
                    label="Default value"
                    onChange={(e) => updateFieldAttr(field.id, "default", e)}
                    defaultValue={field.default}
                  />
                </div>
              </CardSupportingText>
            </Card>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

const ArticleForm = ({
  mode,
  setFields: setExtFields,
}: {
  mode: "add" | "edit";
  setFields: (incFields: Omit<FormField, "id">[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [fields, setFields] = useState<FormField[]>([]);
  useEffect(() => setExtFields(fields), [fields]);

  // Note: this ID won’t be used in Supabase. This is purely for keeping track of
  // fields client-side.
  const [latestID, incrementID] = useReducer((value) => value + 1, 0);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="checklist" allowCustomSize />}
        text="Form"
      />
      <Actions>
        <Button
          type="filled"
          label="Add to list"
          onClick={() => {
            setFields([
              {
                id: latestID,
                label: { th: `Test Question ${latestID}` },
                type: "short_answer",
                required: false,
              },
              ...fields,
            ]);
            incrementID();
          }}
        />
      </Actions>
      <div className="layout-grid-cols-3 flex-col-reverse">
        <FieldList fields={fields} setFields={setFields} />
        {fields.length > 0 && (
          <Card
            type="stacked"
            appearance="outlined"
            className="h-fit px-3 py-2"
          >
            TODO: Preview
          </Card>
        )}
      </div>
      <div className="flex flex-col gap-2"></div>
    </Section>
  );
};

export default ArticleForm;
