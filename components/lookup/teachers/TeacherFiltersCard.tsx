import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useTrackSearch from "@/utils/helpers/search/useTrackSearch";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  DURATION,
  Divider,
  MaterialIcon,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { snake } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * The Search Filters Card for Teachers.
 *
 * @param subjectGroups The list of all Subject Groups a Teacher can belong to.
 */
const TeacherFiltersCard: StylableFC<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("search/teachers/form");

  const trackSearch = useTrackSearch();
  const { setSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const [overflowHid, setOverflowHid] = useState(true);
  useEffect(() => {
    setTimeout(() => setOverflowHid(false), DURATION.long4 * 1000);
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
      setSnackbar(<Snackbar>{t("common:snackbar.formInvalid")}</Snackbar>);
      return;
    }

    trackSearch("Search Teachers", form, entries.length);

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
      title={t("title")}
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
        label={t("form.fullName")}
        helperMsg={t("form.fullName_helper")}
        {...formProps.fullName}
      />
      <TextField
        appearance="outlined"
        label={t("form.nickname")}
        helperMsg={t("form.nickname_helper")}
        {...formProps.nickname}
      />
      <Select
        appearance="outlined"
        label={t("form.subjectGroup")}
        helperMsg={t("form.subjectGroup_helper")}
        {...formProps.subjectGroup}
      >
        <MenuItem value="any">{t("form.subjectGroup_default")}</MenuItem>
        <Divider className="my-1" />
        {subjectGroups.map((subjectGroup) => (
          <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
            {getLocaleString(subjectGroup.name, locale)}
          </MenuItem>
        ))}
      </Select>
      <TextField
        appearance="outlined"
        label={t("form.classroom")}
        helperMsg={t("form.classroom_helper")}
        {...formProps.classroom}
      />
      <TextField
        appearance="outlined"
        label={t("form.contact")}
        helperMsg={t("form.contact_helper")}
        {...formProps.contact}
      />
    </SearchFiltersCard>
  );
};

export default TeacherFiltersCard;
