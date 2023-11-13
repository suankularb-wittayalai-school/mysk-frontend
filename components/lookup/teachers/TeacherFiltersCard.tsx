// Imports
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  Divider,
  MaterialIcon,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  useAnimationConfig,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { pascal, snake } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * The Search Filters Card for Teachers.
 *
 * @param subjectGroups The list of all Subject Groups a Teacher can belong to.
 */
const TeacherFiltersCard: StylableFC<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", {
    keyPrefix: "teachers.searchFilters.form",
  });
  const { t: tc } = useTranslation("lookup");
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
        Object.entries(form).map(([key, value]) => [
          "include" + pascal(snake(key)),
          key === "subjectGroup" && value === "any"
            ? false
            : Boolean(form[key as keyof typeof form]),
        ]),
      ),
    });

    setOverflowHid(true);
    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    router.push(
      `/search/teachers/results?${new URLSearchParams(
        // Convert form keys to snake case
        Object.fromEntries(entries.map(([key, value]) => [snake(key), value])),
      )}`,
    );
  }

  return (
    <SearchFiltersCard
      icon={<MaterialIcon icon="support_agent" />}
      title={tc("teachers.title")}
      onSubmit={handleSubmit}
      style={style}
      className={cn(
        `mb-52`,
        overflowHid ? `!overflow-hidden` : `!overflow-visible`,
        className,
      )}
    >
      <TextField
        appearance="outlined"
        label={t("fullName")}
        helperMsg={t("fullName_helper")}
        {...formProps.fullName}
      />
      <TextField
        appearance="outlined"
        label={t("nickname")}
        helperMsg={t("nickname_helper")}
        {...formProps.nickname}
      />
      <Select
        appearance="outlined"
        label={t("subjectGroup")}
        helperMsg={t("subjectGroup_helper")}
        {...formProps.subjectGroup}
      >
        <MenuItem value="any">{t("subjectGroup_default")}</MenuItem>
        <Divider className="my-1" />
        {subjectGroups.map((subjectGroup) => (
          <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
            {getLocaleString(subjectGroup.name, locale)}
          </MenuItem>
        ))}
      </Select>
      <TextField
        appearance="outlined"
        label={t("classroom")}
        helperMsg={t("classroom_helper")}
        {...formProps.classroom}
      />
      <TextField
        appearance="outlined"
        label={t("contact")}
        helperMsg={t("contact_helper")}
        {...formProps.contact}
      />
    </SearchFiltersCard>
  );
};

export default TeacherFiltersCard;
