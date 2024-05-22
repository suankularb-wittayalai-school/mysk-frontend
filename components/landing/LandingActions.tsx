import LanguageSwitcher from "@/components/landing/LanguageSwitcher";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { forwardRef } from "react";
import PatchNotesDialog from "./PatchNotesDialog";

/**
 * Supplementary actions for the Landing page.
 */
const LandingActions: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("landing", { keyPrefix: "action" });

  const plausible = usePlausible();

  return (
    <Actions
      align="left"
      style={style}
      className={cn(`sm:!justify-center`, className)}
    >
      <LanguageSwitcher
        className={cn(
          {
            th: `[--help-btn-w:7.75rem]`,
            "en-US": `[--help-btn-w:6.25rem]`,
          }[locale],
          `w-[calc(100vw-(3.5rem+5px+var(--help-btn-w)))] sm:!hidden`,
        )}
      />
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="help" />}
        onClick={() =>
          plausible("Open User Guide", { props: { location: "Landing" } })
        }
        href="https://docs.google.com/document/d/1yAEVK09BgbpFIPpG5j1xvfCRUGUdRyL9S1gAxh9UjfU/edit?usp=sharing"
        // eslint-disable-next-line react/display-name
        element={forwardRef((props, ref) => (
          <a ref={ref} {...props} target="_blank" rel="noreferrer" />
        ))}
      >
        {t("help")}
      </Button>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="report" />}
        onClick={() =>
          plausible("Open Report Form", { props: { location: "Landing" } })
        }
        href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
        // eslint-disable-next-line react/display-name
        element={forwardRef((props, ref) => (
          <a ref={ref} {...props} target="_blank" rel="noreferrer" />
        ))}
      >
        {t("report")}
      </Button>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="star" />}
        onClick={() =>
          plausible("Open Patch Notes", { props: { location: "Landing" } })
        }
        
      >
        {t("new")}
      </Button>
      <PatchNotesDialog open />
      
    </Actions>
  );
};

export default LandingActions;
