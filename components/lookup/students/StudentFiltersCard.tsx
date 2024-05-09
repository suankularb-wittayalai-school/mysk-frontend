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
import { useTranslation } from "next-i18next";
import router from "next/router";
import { snake } from "radash";
import { useContext } from "react";

/**
 * The Search Filters Card for Students.
 */
const StudentsFiltersCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("lookup", {
    keyPrefix: "students.searchFilters.form",
  });
  const { t: tc } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const trackSearch = useTrackSearch();
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const { form, formProps } = useForm<"fullName" | "nickname" | "contact">([
    { key: "fullName" },
    { key: "nickname" },
    { key: "contact" },
  ]);

  function handleSubmit() {
    const entries = Object.entries(form).filter(([_, value]) => value);
    if (entries.length === 0) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
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
      title={tc("students.title")}
      onSubmit={handleSubmit}
      style={style}
      className={className}
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
      <TextField
        appearance="outlined"
        label={t("contact")}
        helperMsg={t("contact_helper")}
        {...formProps.contact}
      />
    </SearchFiltersCard>
  );
};

export default StudentsFiltersCard;
