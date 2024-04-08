// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { FullscreenDialog, useBreakpoint } from "@suankularb-components/react";
import Head from "next/head";
import { ReactNode } from "react";

/**
 * The Dialog counterpart to Lookup Details Side, meant for mobile and when
 * Lookup Details Card is shown in other pages.
 *
 * @param children The content of the Dialog.
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const LookupDetailsDialog: StylableFC<{
  children: ReactNode;
  open?: boolean;
  onClose: () => void;
}> = ({ children, open, onClose, style, className }) => {
  const { atBreakpoint } = useBreakpoint();

  return (
    <>
      {open && atBreakpoint === "base" && (
        <Head>
          <meta
            key="theme-color-light"
            name="theme-color"
            content="#dde3ea" // surface-variant
            media="(prefers-color-scheme: light)"
          />
          <meta
            key="theme-color-dark"
            name="theme-color"
            content="#41484d" // surface-variant
            media="(prefers-color-scheme: dark)"
          />
        </Head>
      )}
      <FullscreenDialog
        open={open}
        title=""
        width={680}
        onClose={onClose}
        style={style}
        className={cn(
          `sm:divide-y-0 [&>:first-child>button]:pointer-events-auto
          [&>:first-child]:pointer-events-none [&>:first-child]:!max-w-[42.5rem]
          [&>:first-child]:!flex-row-reverse [&>:first-child]:!bg-transparent
          sm:[&>:first-child]:!fixed [&>:last-child>div]:!mx-0
          [&>:last-child>div]:!rounded-none [&>:last-child>div]:!border-0
          [&>:last-child]:h-[100dvh] [&>:last-child]:!p-0`,
          className,
        )}
      >
        {children}
      </FullscreenDialog>
    </>
  );
};

export default LookupDetailsDialog;
