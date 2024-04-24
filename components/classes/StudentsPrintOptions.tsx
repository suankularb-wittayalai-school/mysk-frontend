import {
  MAXIMUM_EMPTY_COLUMNS,
  OptionsType,
} from "@/components/classes/StudentListPrintout";
import PrintOptions from "@/components/common/print/PrintOptions";
import { FormControlProps } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import {
  Checkbox,
  FormGroup,
  FormItem,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { toggle } from "radash";
import { FC } from "react";

/**
 * Options for the Student List Printout. People can choose which columns to
 * display, how many empty columns to display, and configure other options here.
 *
 * @param form The form control values.
 * @param setForm The form setter.
 * @param formProps The form control props.
 * @param user The user visiting the page. Exposes Student ID if the user isn't a Student.
 */
const StudentsPrintOptions: FC<{
  form: OptionsType;
  setForm: (form: OptionsType) => void;
  formProps: FormControlProps<keyof OptionsType>;
  user: User | null;
}> = ({ form, setForm, formProps, user }) => {
  const { t } = useTranslation("classes", { keyPrefix: "print" });

  return (
    <PrintOptions parentURL="/classes">
      <section className="flex flex-col gap-6 px-4 pb-5 pt-6">
        <Select
          appearance="outlined"
          label={t("language")}
          {...formProps.language}
        >
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="th">ภาษาไทย</MenuItem>
        </Select>
        <FormGroup label={t("columns.label")}>
          {(
            [
              "classNo",
              user &&
                (user.is_admin || user.role !== UserRole.student) &&
                "studentID",
              "prefix",
              "fullName",
              "nickname",
              "allergies",
              "shirtSize",
              "pantsSize",
              "elective",
            ].filter((column) => column) as OptionsType["columns"]
          ).map((column) => (
            <FormItem key={column} label={t(`columns.${column}`)}>
              <Checkbox
                value={form.columns.includes(column)}
                onChange={() =>
                  setForm({ ...form, columns: toggle(form.columns, column) })
                }
              />
            </FormItem>
          ))}
        </FormGroup>
        <TextField
          appearance="outlined"
          label={t("numEmpty")}
          inputAttr={{
            type: "number",
            min: 0,
            max: MAXIMUM_EMPTY_COLUMNS,
            step: 1,
          }}
          {...formProps.numEmpty}
        />
        <FormItem
          label={t("enableNotes")}
          labelAttr={{ className: "skc-text skc-text--title-medium grow" }}
          className="items-center"
        >
          <Switch
            value={form.enableNotes}
            onChange={(enableNotes) => setForm({ ...form, enableNotes })}
          />
        </FormItem>
        <FormItem
          label={t("enableTimestamp")}
          labelAttr={{ className: "skc-text skc-text--title-medium grow" }}
          className="items-center"
        >
          <Switch
            value={form.enableTimestamp}
            onChange={(enableTimestamp) =>
              setForm({ ...form, enableTimestamp })
            }
          />
        </FormItem>
      </section>
    </PrintOptions>
  );
};

export default StudentsPrintOptions;
