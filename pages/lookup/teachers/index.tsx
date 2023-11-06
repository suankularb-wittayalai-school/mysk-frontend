// Imports
import PageHeader from "@/components/common/PageHeader";
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
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
  Snackbar,
  TextField,
  useAnimationConfig,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { pascal, snake } from "radash";
import { useContext, useEffect, useState } from "react";

const LookupTeachersPage: NextPage<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

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
    const entries = Object.entries(form).filter(
      ([key, value]) => value && !(key === "subjectGroup" && value === "any"),
    );
    if (entries.length === 0) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }

    va.track("Search Teachers", {
      filterCount: entries.length,
      ...Object.fromEntries(
        Object.keys(form).map((key) => ["include" + pascal(snake(key)), false]),
      ),
      ...Object.fromEntries(
        entries.map(([key]) => ["include" + pascal(snake(key)), true]),
      ),
    });

    setOverflowHid(true);
    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    router.push(
      `/lookup/teachers/results?${new URLSearchParams(
        // Convert form keys to snake case
        Object.fromEntries(entries.map(([key, value]) => [snake(key), value])),
      )}`,
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
          className={cn(
            `mb-52`,
            overflowHid ? `!overflow-hidden` : `!overflow-visible`,
          )}
        >
          <TextField
            appearance="outlined"
            label={t("searchFilters.form.fullName")}
            helperMsg={t("searchFilters.form.fullName_helper")}
            {...formProps.fullName}
          />
          <TextField
            appearance="outlined"
            label={t("searchFilters.form.nickname")}
            helperMsg={t("searchFilters.form.nickname_helper")}
            {...formProps.nickname}
          />
          <Select
            appearance="outlined"
            label={t("searchFilters.form.subjectGroup")}
            helperMsg={t("searchFilters.form.subjectGroup_helper")}
            {...formProps.subjectGroup}
          >
            <MenuItem value="any">
              {t("searchFilters.form.subjectGroup_default")}
            </MenuItem>
            <Divider className="my-1" />
            {subjectGroups.map((subjectGroup) => (
              <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
                {getLocaleString(subjectGroup.name, locale)}
              </MenuItem>
            ))}
          </Select>
          <TextField
            appearance="outlined"
            label={t("searchFilters.form.classroom")}
            helperMsg={t("searchFilters.form.classroom_helper")}
            {...formProps.classroom}
          />
          <TextField
            appearance="outlined"
            label={t("searchFilters.form.contact")}
            helperMsg={t("searchFilters.form.contact_helper")}
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
