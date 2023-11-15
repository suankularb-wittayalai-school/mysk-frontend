// Imports
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import {
  ChipSet,
  FilterChip,
  MaterialIcon,
  TextField,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { camel, pascal, snake, toggle } from "radash";

/**
 * The Search Filters Card for Documents.
 */
const DocumentFiltersCard: StylableFC = ({ style, className }) => {
  // Translation
  const { t } = useTranslation("lookup", {
    keyPrefix: "documents.searchFilters.form",
  });
  const { t: tc } = useTranslation("lookup");

  const router = useRouter();

  // Form control
  const { form, setForm, formProps } = useForm<
    "types" | "subject" | "attendTo" | "month" | "code"
  >([
    {
      key: "types",
      defaultValue: ["order", "record", "announcement", "big_garuda", "other"],
    },
    { key: "subject" },
    { key: "attendTo" },
    {
      key: "month",
      validate: (value) => value.match(/^\d{4}-(0[1-9]|1[0-2])$/),
    },
    { key: "code" },
  ]);

  function handleSubmit() {
    const entries = Object.entries(form).filter(([_, value]) => value);

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
