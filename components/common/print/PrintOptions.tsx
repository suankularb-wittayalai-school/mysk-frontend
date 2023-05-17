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

// Hooks
import { usePageIsLoading } from "@/utils/hooks/routing";

const PrintOptions: FC<{
  children: ReactNode;
  parentURL: string;
}> = ({ children, parentURL }) => {
  const { t } = useTranslation("common");

  const { pageIsLoading } = usePageIsLoading();

  return (
    <aside
      className="fixed bottom-20 z-50 w-screen divide-y-1 divide-outline
      rounded-t-xl bg-surface-3 shadow-3 print:hidden sm:inset-0 sm:left-auto
      sm:h-auto sm:w-96 sm:rounded-l-xl sm:rounded-tr-none sm:bg-surface
      md:top-0 md:shadow-none lg:sticky lg:top-8 lg:w-full lg:rounded-r-xl"
    >
      <header className="relative flex flex-row items-center gap-2 py-2 pl-2 pr-4">
        <Button
          appearance="text"
          icon={<MaterialIcon icon="arrow_backward" />}
          alt="Navigate up"
          href={parentURL}
          element={Link}
          className="!text-on-surface state-layer:!bg-on-surface"
        />
        <h2 className="skc-title-large">Print options</h2>
        <Progress
          appearance="linear"
          alt={t("pageLoading")}
          visible={pageIsLoading}
          className="absolute inset-0 top-auto"
        />
      </header>
      <p className="skc-label-medium p-4 text-on-surface-variant">
        Note: preview may not be 100% accurate. You may need to adjust scaling
        or other settings in your browser’s print dialog.
      </p>
      <div
        className="h-56 overflow-x-auto sm:h-auto
          [&_.skc-chip-set\_\_label]:!bg-surface-3
          [&_.skc-chip-set\_\_label]:sm:!bg-surface
          [&_.skc-select--outlined_.skc-select\_\_label]:!bg-surface-3
          [&_.skc-select--outlined_.skc-select\_\_label]:sm:!bg-surface
          [&_.skc-text-field--outlined_.skc-text-field\_\_label]:!bg-surface-3
          [&_.skc-text-field--outlined_.skc-text-field\_\_label]:sm:!bg-surface"
      >
        {children}
      </div>
      <Actions className="px-4 py-3.5">
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="print" />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Actions>
    </aside>
  );
};

export default PrintOptions;
