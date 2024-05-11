import PrintPreviewLayout from "@/components/common/print/PrintPreviewLayout";
import cn from "@/utils/helpers/cn";
import {
  Actions,
  Button,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, ReactNode } from "react";

/**
 * Configurations for a print preview. The second child of
 * {@link PrintPreviewLayout Print Preview Layout}.
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

  return (
    <aside
      className={cn(`fixed bottom-0 z-[70] w-screen divide-y-1 divide-outline
        rounded-t-xl bg-surface-bright shadow-3 sm:inset-0 sm:left-auto
        sm:h-auto sm:w-96 sm:rounded-l-xl sm:rounded-tr-none sm:bg-surface
        md:top-0 md:shadow-none lg:sticky lg:bottom-8 lg:top-8 lg:w-full
        lg:rounded-r-xl print:hidden`)}
    >
      <header
        className={cn(`relative flex flex-row items-center gap-2 py-2 pl-2
          pr-4`)}
      >
        <Button
          appearance="text"
          icon={<MaterialIcon icon="arrow_backward" />}
          alt={t("action.back")}
          href={parentURL}
          element={Link}
          className="!text-on-surface state-layer:!bg-on-surface"
        />
        <Text type="title-large" element="h2">
          {t("title")}
        </Text>
      </header>
      <div
        className={cn(`h-64 overflow-x-auto sm:h-auto
          sm:max-h-[calc(100vh-7.8125rem)] lg:max-h-[calc(100vh-11.8125rem)]`)}
      >
        <Text
          type="label-medium"
          element="p"
          className={cn(`sticky top-0 z-20 border-b-1
            border-outline bg-surface-bright p-4 text-on-surface-variant
            sm:bg-surface`)}
        >
          {t("note")}
        </Text>
        <div
          className={cn(`[&_.skc-select--outlined>label]:!bg-surface-bright
            [&_.skc-select--outlined>label]:sm:!bg-surface
            [&_.skc-text-field--outlined>span]:!bg-surface-bright
            [&_.skc-text-field--outlined>span]:sm:!bg-surface`)}
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
