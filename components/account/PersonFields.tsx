// External libraries
import { Trans, useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  Columns,
  Header,
  MenuItem,
  Section,
  Select,
  TextField,
} from "@suankularb-components/react";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { FormControlProps } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";

const ThaiNameSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3} className="sr-only">
        {t("profile.name.title")}
      </Header>
      <Columns columns={4} className="my-3 !gap-y-12">
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
  );
};

const EnglishNameSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3} className="sr-only">
        {t("profile.enName.title")}
      </Header>
      <Columns columns={4} className="my-3 !gap-y-12">
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
  );
};

const RoleSection: FC<{
  formProps: FormControlProps;
  subjectGroups: SubjectGroup[];
}> = ({ formProps, subjectGroups }) => {
  const locale = useLocale();
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3} className="sr-only">
        {t("profile.role.title")}
      </Header>
      <Columns columns={4} className="my-3 !gap-y-12">
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
  );
};

const MiscellaneousSection: FC<{
  formProps: FormControlProps;
}> = ({ formProps }) => {
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3} className="sr-only">
        {t("profile.general.title")}
      </Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        {/* <Select
          appearance="outlined"
          label={t("profile.general.gender.label")}
          {...formProps.gender}
        >
          <MenuItem value="male">{t("profile.general.gender.male")}</MenuItem>
          <MenuItem value="female">
            {t("profile.general.gender.female")}
          </MenuItem>
          <MenuItem value="non-binary">
            {t("profile.general.gender.nonBinary")}
          </MenuItem>
          <MenuItem value="no-response">
            {t("profile.general.gender.noReponse")}
          </MenuItem>
        </Select> */}
        <TextField
          appearance="outlined"
          label={t("profile.general.birthDate")}
          inputAttr={{ type: "date" }}
          {...formProps.birthdate}
        />
        {/* <TextField
          appearance="outlined"
          label={t("profile.general.citizenID")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          inputAttr={{ type: "number" }}
          {...formProps.citizenID}
        /> */}
        {/* <TextField
          appearance="outlined"
          label={t("profile.general.passportNumber")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.passportNumber}
        /> */}
        <TextField
          appearance="outlined"
          label={t("profile.general.allergies")}
          behavior="multi-line"
          helperMsg={t("profile.general.allergies_helper")}
          {...formProps.allergies}
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
        {/* <Select
          appearance="outlined"
          label={t("profile.general.bloodGroup")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.bloodGroup}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="AB">AB</MenuItem>
          <MenuItem value="O">O</MenuItem>
        </Select> */}
      </Columns>
    </Section>
  );
};

const PersonFields: FC<{
  subjectGroups?: SubjectGroup[];
  formProps: FormControlProps<
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
    | "gender"
    | "birthdate"
    | "citizenID"
    | "passportNumber"
    | "shirtSize"
    | "pantsSize"
    | "bloodGroup"
  >;
}> = ({ subjectGroups, formProps }) => {
  return (
    <>
      <ThaiNameSection {...{ formProps }} />
      <EnglishNameSection {...{ formProps }} />
      {subjectGroups && <RoleSection {...{ formProps, subjectGroups }} />}
      <MiscellaneousSection {...{ formProps }} />
    </>
  );
};

export default PersonFields;
