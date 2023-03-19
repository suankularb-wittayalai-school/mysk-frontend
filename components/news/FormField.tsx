// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  Checkbox,
  FormGroup,
  FormItem,
  Radio,
  TextField,
} from "@suankularb-components/react";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { FormField as FormFieldType } from "@/utils/types/news";

const FormField: FC<{
  field: FormFieldType;
  value: string | number | string[] | File;
  onChange: (value: string | number | string[] | File) => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ field, value, onChange, className, style }) => {
  // Translation
  const { t } = useTranslation("common");
  const locale = useLocale();

  return [
    "short_answer",
    "paragraph",
    "dropdown",
    "file",
    "date",
    "time",
  ].includes(field.type) ? (
    <div>
      <div
        aria-labelledby={`form-field-${field.id}`}
        className="skc-title-small pt-2 pb-3"
      >
        {getLocaleString(field.label, locale)}
      </div>
      <TextField
        appearance="outlined"
        label="Enter response"
        value={typeof value === "string" ? value : undefined}
        required={field.required}
        onChange={onChange}
        inputAttr={{
          id: `form-field-${field.id}`,
          type: field.type !== "short_answer" ? field.type : undefined,
        }}
      />
    </div>
  ) : (
    <FormGroup label={getLocaleString(field.label, locale)}>
      {field.options?.map((option) => (
        <FormItem key={option} label={option}>
          {field.type === "check_box" ? (
            <Checkbox
              value={(value as string[]).includes(option)}
              onChange={() => onChange(toggleItem(option, value as string[]))}
            />
          ) : (
            field.type === "multiple_choice" && (
              <Radio
                value={value === option}
                onChange={() => onChange(option)}
              />
            )
          )}
        </FormItem>
      ))}
    </FormGroup>
  );
};

export default FormField;
