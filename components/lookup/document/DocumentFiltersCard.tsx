// Imports
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import {
  ChipSet,
  FilterChip,
  MaterialIcon,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { camel, pascal, snake, toggle } from "radash";
import { useContext, useEffect } from "react";

/**
 * The Search Filters Card for Documents.
 */
const DocumentFiltersCard: StylableFC = ({ style, className }) => {
  // Translation
  const { t } = useTranslation("lookup", {
    keyPrefix: "documents.searchFilters.form",
  });
  const { t: tc } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const router = useRouter();

  // Form control
  const { form, setForm, formProps } = useForm<
    "types" | "subject" | "attendTo" | "month" | "code"
  >([
    {
      key: "types",
      defaultValue: [],
      validate: (value) => value.length > 0,
    },
    { key: "subject" },
    { key: "attendTo" },
    {
      key: "month",
      validate: (value) => value.match(/^\d{4}-(0[1-9]|1[0-2])$/),
    },
    { key: "code" },
  ]);

  // Automatically select all types if any other field is filled as the user
  // likely wants to search for Documents of all types
  useEffect(
    () => {
      // Check if any field except type is filled
      const someFieldsAreFilled = Object.values(form)
        .slice(1)
        .some((value) => value);

      // If any field is filled, select all types
      if (someFieldsAreFilled) {
        if (form.types.length === 0)
          setForm({
            ...form,
            types: ["order", "record", "announcement", "big_garuda", "other"],
          });
      }
      // If no field is filled and all types are selected, deselect all types
      else if (form.types.length === 5) setForm({ ...form, types: [] });
    },
    // Run when one of all fields except type are changed
    Object.values(form).slice(1),
  );

  // Remove the prefix and suffix from the code field
  useEffect(() => {
    setForm({
      ...form,
      code: (form.code as string)
        .replace(/^(ศธ|MoE) 04290.20\/|/, "")
        .replace(/\/\d{4}$/, ""),
    });
  }, [form.code]);

  /**
   * Redirect to the Document Search Results page with the form values as
   * query.
   */
  function handleSubmit() {
    const entries = Object.entries(form).filter(([_, value]) => value);
    if (
      entries.some(([key, value]) =>
        key === "types" ? value.length === 0 : !value,
      )
    ) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }

    va.track("Search Documents", {
      filterCount: entries.length,
      ...Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          "include" + pascal(snake(key)),
          Boolean(value),
        ]),
      ),
    });

    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    router.push(
      `/search/documents/results?${new URLSearchParams(
        // Convert form keys to snake case
        Object.fromEntries(entries.map(([key, value]) => [snake(key), value])),
      )}`,
    );
  }

  return (
    <SearchFiltersCard
      icon={<MaterialIcon icon="document_scanner" />}
      title={tc("documents.title")}
      onSubmit={handleSubmit}
      style={style}
      className={className}
    >
      <ChipSet
        scrollable
        className="-mx-4 -mb-6 sm:col-span-2 md:col-span-4 [&>*]:px-4"
      >
        {["order", "record", "announcement", "big_garuda", "other"].map(
          (type) => (
            <FilterChip
              key={type}
              selected={form.types.includes(type)}
              onClick={() =>
                setForm({ ...form, types: toggle(form.types, type) })
              }
            >
              {t(`type.${camel(type)}`)}
            </FilterChip>
          ),
        )}
      </ChipSet>
      <TextField
        appearance="outlined"
        label={t("subject")}
        helperMsg={t("subject_helper")}
        {...formProps.subject}
      />
      <TextField
        appearance="outlined"
        label={t("attendTo")}
        helperMsg={t("attendTo_helper")}
        {...formProps.attendTo}
      />
      <TextField
        appearance="outlined"
        label={t("month")}
        helperMsg={t("month_helper")}
        inputAttr={{ type: "month", placeholder: "YYYY-MM" }}
        {...formProps.month}
      />
      <TextField
        appearance="outlined"
        label={t("code")}
        helperMsg={t("code_helper")}
        {...formProps.code}
      />
    </SearchFiltersCard>
  );
};

export default DocumentFiltersCard;
