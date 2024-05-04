import {
  MAXIMUM_EMPTY_COLUMNS,
  OptionsType,
} from "@/components/classes/StudentListPrintout";
import PrintOptions from "@/components/common/print/PrintOptions";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import permitted from "@/utils/helpers/permitted";
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
 */
const StudentsPrintOptions: FC<{
  form: OptionsType;
  setForm: (form: OptionsType) => void;
  formProps: FormControlProps<keyof OptionsType>;
}> = ({ form, setForm, formProps }) => {
  const { t } = useTranslation("classes", { keyPrefix: "print" });

  const mysk = useMySKClient();

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
              mysk.user &&
                (mysk.user.is_admin || mysk.user.role !== UserRole.student) &&
                "studentID",
              "prefix",
              "fullName",
              "nickname",
              "allergies",
              "shirtSize",
              "pantsSize",
              mysk.user &&
                (mysk.user.is_admin || mysk.user.role !== UserRole.student) &&
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

        <FormGroup label={t("filters.label")}>
          {(
            [
              mysk.user &&
                (mysk.user.is_admin || mysk.user.role !== UserRole.student) &&
                "noElective",
                "hasAllergies",
            ].filter((filters) => filters) as OptionsType["filters"]
          ).map((filters) => (
            <FormItem key={filters} label={t(`filters.${filters}`)}>
              <Checkbox
                value={form.filters.includes(filters)}
                onChange={() =>
                  setForm({ ...form, filters: toggle(form.filters, filters) })
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
