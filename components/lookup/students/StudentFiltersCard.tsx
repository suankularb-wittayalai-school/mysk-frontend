// Imports
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import {
  MaterialIcon,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { pascal, snake } from "radash";
import { useContext } from "react";

/**
 * The Search Filters Card for Students.
 */
const StudentsFiltersCard: StylableFC = ({ style, className }) => {
  const { t: tx } = useTranslation("common");

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

    va.track("Search Students", {
      filterCount: entries.length,
      ...Object.fromEntries(
        Object.keys(form).map((key) => [
          "include" + pascal(snake(key)),
          Boolean(form[key as keyof typeof form]),
        ]),
      ),
    });

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
      icon={<MaterialIcon icon="face_6" />}
      title="Search students"
      onSubmit={handleSubmit}
      style={style}
      className={className}
    >
      <TextField
        appearance="outlined"
        label="Search full name"
        helperMsg="Enter partially or fully the full name of a student"
        {...formProps.fullName}
      />
      <TextField
        appearance="outlined"
        label="Search nickname"
        helperMsg="Enter partially or fully the full name of a student"
        {...formProps.nickname}
      />
      <TextField
        appearance="outlined"
        label="Search contact"
        helperMsg="Enter fully a username, email, tel., or URL of a student’s contact"
        {...formProps.contact}
      />
    </SearchFiltersCard>
  );
};

export default StudentsFiltersCard;

