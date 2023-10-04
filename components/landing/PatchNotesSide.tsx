// Imports
import useLocale from "@/utils/helpers/useLocale";
import usePreferences from "@/utils/helpers/usePreferences";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { LangCode, StylableFC } from "@/utils/types/common";
import { SegmentedButton, Button, Text } from "@suankularb-components/react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import cn from "@/utils/helpers/cn";

/**
 * Patch notes of the most recent major update.
 */
const PatchNotesSide: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const [visibleLocale, setVisibleLocale] = useState<LangCode>(locale);
  const { t } = useTranslation("landing", { keyPrefix: "aside" });

  const { setPreference } = usePreferences();
  const refreshProps = useRefreshProps();

  function changeLocaleTo(locale: LangCode) {
    // Give immediate visual feedback
    setVisibleLocale(locale);
    // Remember the preference
    setPreference("locale", locale);
    // Redirect to the new language
    refreshProps({ locale });
  }

  return (
    <section
      style={style}
      className={cn(
        `relative flex flex-col gap-6 bg-surface-variant`,
        className,
      )}
    >
      {/* Language Switcher */}
      <SegmentedButton
        alt={t("languageSwitcher.title")}
        full
        className="rounded-full bg-surface sm:mb-2"
      >
        <Button
          appearance="outlined"
          selected={visibleLocale === "th"}
          onClick={() => changeLocaleTo("th")}
        >
          {t("languageSwitcher.th")}
        </Button>
        <Button
          appearance="outlined"
          selected={visibleLocale === "en-US"}
          onClick={() => changeLocaleTo("en-US")}
        >
          {t("languageSwitcher.en")}
        </Button>
      </SegmentedButton>

      {/* Patch notes */}
      <article aria-label={t("patchNotes.alt")} className="contents">
        <header>
          <Text
            type="title-small"
            element="h2"
            className="text-on-surface-variant"
          >
            {t("patchNotes.overline", {
              version: process.env.NEXT_PUBLIC_VERSION || "Preview",
            })}
          </Text>
          <Text type="title-large" element="p">
            {t("patchNotes.title")}
          </Text>
        </header>
        <ul className="grow list-disc pl-6">
          <li>{t("patchNotes.list.1")}</li>
          <li>{t("patchNotes.list.2")}</li>
          <li>{t("patchNotes.list.3")}</li>
        </ul>
      </article>

      {/* Links */}
      <Text type="body-small" element="p">
        <a
          href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
          target="_blank"
          className="link"
        >
          {t("action.patchNotes")}
        </a>
      </Text>
    </section>
  );
};

export default PatchNotesSide;
