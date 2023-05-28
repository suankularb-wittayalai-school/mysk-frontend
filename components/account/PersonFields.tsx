// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import NextWarningCard from "@/components/welcome/NextWarningCard";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import { getPersonFromUser, editPerson } from "@/utils/backend/person/person";
import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";

// Helpers
import { changeItem } from "@/utils/helpers/array";
import { getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import { classRegex } from "@/utils/patterns";

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
        <Select
          appearance="outlined"
          label={t("profile.general.shirtSize")}
          {...formProps.shirtSize}
        >
          <MenuItem value="XS">XS</MenuItem>
          <MenuItem value="S">S</MenuItem>
          <MenuItem value="M">M</MenuItem>
          <MenuItem value="L">L</MenuItem>
          <MenuItem value="XL">XL</MenuItem>
          <MenuItem value="2XL">2XL</MenuItem>
          <MenuItem value="3XL">3XL</MenuItem>
          <MenuItem value="4XL">4XL</MenuItem>
          <MenuItem value="5XL">5XL</MenuItem>
          <MenuItem value="6XL">6XL</MenuItem>
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
