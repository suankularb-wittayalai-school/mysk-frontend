// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Checklist,
  Dropdown,
  FileInput,
  FormElement,
  KeyboardInput,
  NativeInput,
  RadioGroup,
  Range,
  TextArea,
} from "@suankularb-components/react";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";
import { FormField as FormFieldType } from "@utils/types/news";

const FormField = ({
  field,
  onChange,
  className,
  style,
}: {
  field: FormFieldType;
  onChange: (newValue: string | number | string[] | File) => void;
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  return field.type == "paragraph" ? (
    <TextArea
      key={field.id}
      name={getLocaleString(field.label, locale)}
      label={getLocaleString(field.label, locale)}
      onChange={onChange}
      defaultValue={field.default}
      className={className}
      style={style}
    />
  ) : // Date and time
  ["date", "time"].includes(field.type) ? (
    <NativeInput
      key={field.id}
      name={getLocaleString(field.label, locale)}
      type={field.type as "date" | "time"}
      label={getLocaleString(field.label, locale)}
      onChange={onChange}
      defaultValue={field.default}
      className={className}
      style={style}
    />
  ) : // Dropdown
  field.type == "dropdown" ? (
    <Dropdown
      key={field.id}
      name={getLocaleString(field.label, locale)}
      label={getLocaleString(field.label, locale)}
      options={(field.options as string[]).map((option) => ({
        value: option,
        label: option,
      }))}
      noOptionsText={t("input.none.noOptions")}
      onChange={onChange}
      defaultValue={field.default}
      className={className}
      style={style}
    />
  ) : // File
  field.type == "file" ? (
    <FileInput
      key={field.id}
      name={getLocaleString(field.label, locale)}
      label={getLocaleString(field.label, locale)}
      onChange={onChange}
      noneAttachedMsg={t("input.none.noFilesAttached", {
        ns: "common",
      })}
    />
  ) : ["multiple_choice", "check_box", "scale"].includes(field.type) ? (
    <FormElement
      key={field.id}
      label={getLocaleString(field.label, locale)}
      className={["!mb-6", className].join(" ")}
      style={style}
    >
      {field.type == "multiple_choice" ? (
        // Multiple choice
        <RadioGroup
          name={getLocaleString(field.label, locale)}
          options={(field.options as string[]).map((option) => ({
            id: option,
            value: option,
            label: option,
          }))}
          onChange={onChange}
          defaultValue={field.default}
        />
      ) : field.type == "check_box" ? (
        // Check boxes
        <Checklist
          name={getLocaleString(field.label, locale)}
          options={(field.options as string[]).map((option) => ({
            id: option,
            value: option,
            label: option,
          }))}
          onChange={onChange}
        />
      ) : field.type == "scale" ? (
        // Scale
        <Range
          name={getLocaleString(field.label, locale)}
          min={field.range?.start}
          max={field.range?.end}
          step={1}
          onChange={onChange}
          defaultValue={Number(field.default)}
        />
      ) : null}
    </FormElement>
  ) : (
    // (Fallback) Short answer
    <KeyboardInput
      key={field.id}
      name={getLocaleString(field.label, locale)}
      type="text"
      label={getLocaleString(field.label, locale)}
      onChange={onChange}
      defaultValue={field.default}
      className={className}
      style={style}
    />
  );
};

export default FormField;
