// Imports
import PageHeader from "@/components/common/PageHeader";
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-backend";
import { LangCode } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  ContentLayout,
  Divider,
  MenuItem,
  Select,
  TextField,
  useAnimationConfig,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { snake } from "radash";
import { useEffect, useState } from "react";

const LookupTeachersPage: NextPage<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation("common");

  const router = useRouter();

  const { duration } = useAnimationConfig();
  const [overflowHid, setOverflowHid] = useState(true);
  useEffect(() => {
    setTimeout(() => setOverflowHid(false), duration.long4 * 1000);
  }, []);

  // Form control
  const { form, formProps } = useForm<
    "fullName" | "nickname" | "subjectGroup" | "classroom" | "contact"
  >([
    { key: "fullName" },
    { key: "nickname" },
    { key: "subjectGroup", defaultValue: "any" },
    { key: "classroom" },
    { key: "contact" },
  ]);

  function handleSubmit() {
    setOverflowHid(true);
    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    router.push(
      `/lookup/teachers/results?${new URLSearchParams(
        // Convert form keys to snake case
        Object.fromEntries(
          Object.entries(form)
            .filter(([_, value]) => value)
            .map(([key, value]) => [snake(key), value]),
        ),
      )}`,
      undefined,
      { scroll: false },
    );
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup">{t("title")}</PageHeader>
      <ContentLayout>
        <SearchFiltersCard
          onSubmit={handleSubmit}
          className={overflowHid ? `!overflow-hidden` : `!overflow-visible`}
        >
          <TextField
            appearance="outlined"
            label="Search full name"
            helperMsg="Enter partially or fully the full name of a teacher"
            {...formProps.fullName}
          />
          <TextField
            appearance="outlined"
            label="Search nickname"
            helperMsg="Enter partially or fully the nickname of a teacher"
            {...formProps.nickname}
          />
          <Select
            appearance="outlined"
            label="Choose subject group"
            helperMsg="Select from a list of subject groups assigned to a teacher"
            {...formProps.subjectGroup}
          >
            <MenuItem value="any">Any subject group</MenuItem>
            <Divider className="my-1" />
            {subjectGroups.map((subjectGroup) => (
              <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
                {getLocaleString(subjectGroup.name, locale)}
              </MenuItem>
            ))}
          </Select>
          <TextField
            appearance="outlined"
            label="Search class"
            helperMsg="Enter fully the class number a teacher is the advisor of"
            {...formProps.classroom}
          />
          <TextField
            appearance="outlined"
            label="Search contact"
            helperMsg="Enter fully a username, email, or URL of a class contact"
            {...formProps.contact}
          />
        </SearchFiltersCard>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      subjectGroups,
    },
    revalidate: 3600,
  };
};

export default LookupTeachersPage;
