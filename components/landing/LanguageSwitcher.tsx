import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import usePreferences from "@/utils/helpers/usePreferences";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { LangCode, StylableFC } from "@/utils/types/common";
import { Button, SegmentedButton } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import va from "@vercel/analytics";

/**
 * A Segmented Button to switch between languages in Landing.
 */
const LanguageSwitcher: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const [visibleLocale, setVisibleLocale] = useState<LangCode>(locale);
  const { t } = useTranslation("landing", {
    keyPrefix: "aside.languageSwitcher",
  });

  const { setPreference } = usePreferences();
  const refreshProps = useRefreshProps();

  /**
   * Change the locale to the given one.
   * 
   * @param locale The new locale.
   */
  function changeLocaleTo(locale: LangCode) {
    // Give immediate visual feedback
    setVisibleLocale(locale);
    // Log the event
    va.track("Change Language", { locale, location: "Landing" });
    // Remember the preference
    setPreference("locale", locale);
    // Redirect to the new language
    refreshProps({ locale });
  }

  return (
    <SegmentedButton
      alt={t("title")}
      full
      style={style}
      className={cn(`*:!whitespace-nowrap`, className)}
    >
      {(["th", "en-US"] as LangCode[]).map((locale) => (
        <Button
          key={locale}
          appearance="outlined"
          selected={visibleLocale === locale}
          onClick={() => changeLocaleTo(locale)}
        >
          {t(locale)}
        </Button>
      ))}
    </SegmentedButton>
  );
};

export default LanguageSwitcher;
