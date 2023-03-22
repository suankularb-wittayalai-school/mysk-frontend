// External libraries
import { TextFieldProps } from "@suankularb-components/react";
import { useMemo, useState } from "react";

// Types
import {
  FormControlProps,
  FormControlValids,
  FormControlValues,
} from "@/utils/types/common";

/**
 * A form state manager, handling values, error state, and props for Text Field.
 *
 * @param formSpecs The form specifications: an array of objects with the key, the default value, and a validation function for that field
 * @returns TODO
 */
export function useForm<KeyEnum extends string | symbol>(
  formSpecs: {
    key: KeyEnum;
    defaultValue?: string;
    validate?: (value: string) => boolean;
    required?: boolean;
  }[]
) {
  // An object with default values
  const defaultForm = useMemo<FormControlValues<KeyEnum>>(
    () =>
      formSpecs.reduce(
        (form, field) => ({ ...form, [field.key]: field.defaultValue || "" }),
        {} as FormControlValues<KeyEnum>
      ),
    [formSpecs]
  );

  // The actual “form control” part of this
  const [formValues, setFormValues] =
    useState<FormControlValues<KeyEnum>>(defaultForm);

  // Form validation
  const formValids: FormControlValids<KeyEnum> = Object.keys(formValues).reduce(
    (form, key, idx) => {
      const { validate } = formSpecs[idx];
      return {
        ...form,
        [key]:
          formValues[key as KeyEnum] && validate
            ? !validate(formValues[key as KeyEnum])
            : false,
      };
    },
    {} as FormControlValids<KeyEnum>
  );

  // Form validation (taking into account `required`)
  const formValidsStrict: FormControlValids<KeyEnum> = Object.keys(
    formValids
  ).reduce((form, key, idx) => {
    const { required } = formSpecs[idx];
    return {
      ...form,
      [key]: required ? formValues[key as KeyEnum].length > 0 : true,
    };
  }, {} as FormControlValids<KeyEnum>);
  const formOK = !Object.values(formValidsStrict).find(
    (valid) => valid === false
  );

  // Props for a Text Field/Select
  const formProps: FormControlProps<KeyEnum> = Object.keys(formValues).reduce(
    (form, key, idx) => ({
      ...form,
      [key]: {
        value: formValues[key as KeyEnum],
        onChange: (value: string | File) =>
          setFormValues({ ...formValues, [key]: value as string }),
        error: formValids[key as KeyEnum],
        required: formSpecs[idx].required,
      },
    }),
    {} as {
      [key in KeyEnum]: Pick<
        TextFieldProps,
        "value" | "onChange" | "required" | "error"
      >;
    }
  );

  return {
    /**
     * An object with values representing the value inside each field.
     */
    form: formValues,

    /**
     * Allow setting the value for a specific field.
     *
     * For example, for the key `email`, you’d do:
     *
     * ```ts
     * const { form, setForm } = useForm([
     *   { key: "email" },
     *   // ...
     * ])
     * setForm({ ...form, email: "hi.mom@example.com" })
     * ```
     */
    setForm: setFormValues,

    /**
     * When called, sets all fields to the default value.
     */
    resetForm: () => setFormValues(defaultForm),

    /**
     * An object with values representing the validity of each field.
     *
     * This only takes into account the `validate` function.
     */
    formValids,

    /**
     * An object with values representing the validity of each field, taking
     * into account both the `validate` function and the `required` property.
     */
    formValidsStrict,

    /**
     * If all fields inside the form are valid.
     */
    formOK,

    /**
     * Props for each field’s Text Field or Select component.
     */
    formProps,
  };
}
