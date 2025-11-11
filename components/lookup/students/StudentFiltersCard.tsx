import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import useTrackSearch from "@/utils/helpers/search/useTrackSearch";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import {
  MaterialIcon,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import router from "next/router";
import { snake } from "radash";
import { useContext } from "react";

/**
 * The Search Filters Card for Students.
 */
const StudentsFiltersCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("search/students/form");

  const trackSearch = useTrackSearch();
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const { form, formProps } = useForm<
    "fullName" | "nickname" | "contact" | "studentId"
  >([
    { key: "fullName" },
    { key: "nickname" },
    { key: "contact" },
    { key: "studentId" },
  ]);

  function handleSubmit() {
    const entries = Object.entries(form).filter(([_, value]) => value);
    if (entries.length === 0) {
      setSnackbar(<Snackbar>{t("common:snackbar.formInvalid")}</Snackbar>);
      return;
    }
    trackSearch("Search Students", form, entries.length);

    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    router.push(
      `/search/students/results?${new URLSearchParams(
        // Convert form keys to snake case
        Object.fromEntries(entries.map(([key, value]) => [snake(key), value])),
      )}`,
    );
  }

  return (
    <SearchFiltersCard
      icon={<MaterialIcon icon="face_6" />}
      title={t("title")}
      onSubmit={handleSubmit}
      style={style}
      className={className}
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
      <TextField
        appearance="outlined"
        label={t("form.contact")}
        helperMsg={t("form.contact_helper")}
        {...formProps.contact}
      />
      <TextField
        appearance="outlined"
        label={t("form.studentID")}
        helperMsg={t("form.studentID_helper")}
        {...formProps.studentId}
      />
    </SearchFiltersCard>
  );
};

export default StudentsFiltersCard;
