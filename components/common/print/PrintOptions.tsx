// External libraries
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC, ReactNode } from "react";

// SK Components
import {
  Button,
  MaterialIcon,
  Actions,
  Progress,
} from "@suankularb-components/react";

// Internal components
import PrintPage from "@/components/common/print/PrintPage";

// Hooks
import usePageIsLoading from "@/utils/helpers/usePageIsLoading";

/**
 * Configurations for a print preview. The second child of
 * {@link PrintPage Print Page}.
 *
 * @param children Various form elements for configuration of a print preview.
 * @param parentURL The URL of the page to navigate up to. Used by the back Button.
 *
 * @returns A Bottom/Side Sheet or Card depending on the screen size.
 */
const PrintOptions: FC<{
  children: ReactNode;
  parentURL: string;
}> = ({ children, parentURL }) => {
  const { t } = useTranslation("common", { keyPrefix: "print" });

  const { pageIsLoading } = usePageIsLoading();

  return (
    <aside
      className="fixed bottom-20 z-50 w-screen divide-y-1 divide-outline
        rounded-t-xl bg-surface-3 shadow-3 print:hidden sm:inset-0 sm:left-auto
        sm:h-auto sm:w-96 sm:rounded-l-xl sm:rounded-tr-none sm:bg-surface
        md:top-0 md:shadow-none lg:sticky lg:top-8 lg:w-full lg:rounded-r-xl"
    >
      <header
        className="relative flex flex-row items-center gap-2 py-2 pl-2
          pr-4"
      >
        <Button
          appearance="text"
          icon={<MaterialIcon icon="arrow_backward" />}
          alt={t("action.back")}
          href={parentURL}
          element={Link}
          className="!text-on-surface state-layer:!bg-on-surface"
        />
        <h2 className="skc-title-large">{t("title")}</h2>
        <Progress
          appearance="linear"
          alt={t("pageLoading")}
          visible={pageIsLoading}
          className="absolute inset-0 top-auto"
        />
      </header>
      <div
        className="h-64 overflow-x-auto sm:h-auto
          sm:max-h-[calc(100vh-7.8125rem)] lg:max-h-[calc(100vh-11.8125rem)]"
      >
        <p
          className="skc-label-medium sticky top-0 z-20 border-b-1
            border-outline bg-surface-3 p-4 text-on-surface-variant
            sm:bg-surface"
        >
          {t("note")}
        </p>
        <div
          className="[&_.skc-chip-set\_\_label]:!bg-surface-3
            [&_.skc-chip-set\_\_label]:sm:!bg-surface
            [&_.skc-select--outlined_.skc-select\_\_label]:!bg-surface-3
            [&_.skc-select--outlined_.skc-select\_\_label]:sm:!bg-surface
            [&_.skc-text-field--outlined_.skc-text-field\_\_label]:!bg-surface-3
            [&_.skc-text-field--outlined_.skc-text-field\_\_label]:sm:!bg-surface"
        >
          {children}
        </div>
      </div>
      <Actions className="px-4 py-3.5">
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="print" />}
          onClick={() => window.print()}
        >
          {t("action.print")}
        </Button>
      </Actions>
    </aside>
  );
};

export default PrintOptions;
