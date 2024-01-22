import AllergiesField from "@/components/person/AllergiesField";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import {
  FormControlProps,
  FormControlValues,
  StylableFC,
} from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  Columns,
  Divider,
  Header,
  MenuItem,
  Section,
  Select,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

export type PersonFieldsKey =
  | "prefixTH"
  | "firstNameTH"
  | "middleNameTH"
  | "lastNameTH"
  | "nicknameTH"
  | "prefixEN"
  | "firstNameEN"
  | "middleNameEN"
  | "lastNameEN"
  | "nicknameEN"
  | "subjectGroup"
  | "classAdvisorAt"
  | "birthdate"
  | "allergies"
  | "shirtSize"
  | "pantsSize";

const PersonFields: StylableFC<{
  form: FormControlValues<PersonFieldsKey>;
  setForm: (form: FormControlValues<PersonFieldsKey>) => void;
  formProps: FormControlProps<PersonFieldsKey>;
  subjectGroups: SubjectGroup[];
  role: UserRole;
}> = ({ form, setForm, formProps, subjectGroups, role, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("account");

  return (
    <div style={style} className={cn(`px-[2px] [&>hr]:my-6`, className)}>
      {/* Thai name */}
      <Section>
        <Header level={3} className="sr-only">
          {t("profile.name.title")}
        </Header>
        <Columns columns={3} className="my-3 !gap-y-12">
          <TextField
            appearance="outlined"
            label={t("profile.name.prefix")}
            helperMsg={t("profile.name.prefix_helper")}
            {...formProps.prefixTH}
          />
          <TextField
            appearance="outlined"
            label={t("profile.name.firstName")}
            {...formProps.firstNameTH}
          />
          <TextField
            appearance="outlined"
            label={t("profile.name.middleName")}
            helperMsg={t("profile.name.middleName_helper")}
            {...formProps.middleNameTH}
          />
          <TextField
            appearance="outlined"
            label={t("profile.name.lastName")}
            {...formProps.lastNameTH}
          />
          <TextField
            appearance="outlined"
            label={t("profile.name.nickname")}
            {...formProps.nicknameTH}
          />
        </Columns>
      </Section>

      <Divider />

      {/* English name */}
      <Section>
        <Header level={3} className="sr-only">
          {t("profile.enName.title")}
        </Header>
        <Columns columns={3} className="my-3 !gap-y-12">
          <TextField
            appearance="outlined"
            label={t("profile.enName.prefix")}
            helperMsg={t("profile.enName.prefix_helper")}
            {...formProps.prefixEN}
          />
          <TextField
            appearance="outlined"
            label={t("profile.enName.firstName")}
            {...formProps.firstNameEN}
          />
          <TextField
            appearance="outlined"
            label={t("profile.enName.middleName")}
            helperMsg={t("profile.name.middleName_helper")}
            {...formProps.middleNameEN}
          />
          <TextField
            appearance="outlined"
            label={t("profile.enName.lastName")}
            {...formProps.lastNameEN}
          />
          <TextField
            appearance="outlined"
            label={t("profile.enName.nickname")}
            {...formProps.nicknameEN}
          />
        </Columns>
      </Section>

      <Divider />

      {/* Role */}
      {role === UserRole.teacher && (
        <>
          <Section>
            <Header level={3} className="sr-only">
              {t("profile.role.title")}
            </Header>
            <Columns columns={3} className="my-3 !gap-y-12">
              <Select
                appearance="outlined"
                label={t("profile.role.subjectGroup")}
                helperMsg={t("profile.role.subjectGroup_helper")}
                {...formProps.subjectGroup}
              >
                {subjectGroups.map((subjectGroup) => (
                  <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
                    {getLocaleString(subjectGroup.name, locale)}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                appearance="outlined"
                label={t("profile.role.classAdvisorAt")}
                helperMsg={t("profile.role.classAdvisorAt_helper")}
                {...formProps.classAdvisorAt}
              />
            </Columns>
          </Section>

          <Divider />
        </>
      )}

      {/* Miscellaneous */}
      <Section>
        <Header level={3} className="sr-only">
          {t("profile.misc.title")}
        </Header>
        <Columns columns={3} className="my-3 !gap-y-12">
          <TextField
            appearance="outlined"
            label={t("profile.general.birthDate")}
            inputAttr={{ type: "date" }}
            {...formProps.birthdate}
          />
          <AllergiesField
            allergies={form.allergies}
            onChange={(allergies) => setForm({ ...form, allergies })}
          />
          <Select
            appearance="outlined"
            label={t("profile.general.shirtSize.label")}
            {...formProps.shirtSize}
          >
            {[
              { size: "XS", measurement: 34 },
              { size: "S", measurement: 36 },
              { size: "M", measurement: 38 },
              { size: "L", measurement: 40 },
              { size: "XL", measurement: 42 },
              { size: "2XL", measurement: 44 },
              { size: "3XL", measurement: 48 },
              { size: "4XL", measurement: 52 },
              { size: "5XL", measurement: 56 },
              { size: "6XL", measurement: 60 },
            ].map((option) => (
              <MenuItem
                key={option.size}
                metadata={t("profile.general.shirtSize.metadata", {
                  count: option.measurement,
                })}
                value={option.size}
              >
                {option.size}
              </MenuItem>
            ))}
          </Select>
          <TextField
            appearance="outlined"
            label={t("profile.general.pantsSize")}
            className="[&>input]:[font-feature-settings:'calt'on]"
            {...formProps.pantsSize}
          />
        </Columns>
      </Section>
    </div>
  );
};

export default PersonFields;
