import cn from "@/utils/helpers/cn";
import useBreakpoint, { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { StylableFC } from "@/utils/types/common";
import { FullscreenDialog } from "@suankularb-components/react";
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
      {open && atBreakpoint(Breakpoint.base) && (
        <Head>
          <meta
            key="theme-color-light"
            name="theme-color"
            content="#dfe3e7" // surface-container-highest
            media="(prefers-color-scheme: light)"
          />
          <meta
            key="theme-color-dark"
            name="theme-color"
            content="#313539" // surface-container-highest
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
          // Support children Dialogs and remove border under Top App Bar.
          `!overflow-y-visible sm:divide-y-0`,

          // Remove Top App Bar but keep close Button (moved to the right).
          `[&>:first-child>button]:pointer-events-auto
          [&>:first-child]:pointer-events-none [&>:first-child]:!max-w-[42.5rem]
          [&>:first-child]:!flex-row-reverse [&>:first-child]:!bg-transparent
          [&>:first-child]:sm:!fixed`,

          // Return rounded corners removed by removing overflow clipping
          // and format content.
          `[&>:last-child>div]:!mx-0
          [&>:last-child>div]:!rounded-none [&>:last-child>div]:!border-0
          [&>:last-child]:h-dvh [&>:last-child]:!rounded-xl
          [&>:last-child]:!p-0`,
          className,
        )}
      >
        {children}
      </FullscreenDialog>
    </>
  );
};

export default LookupDetailsDialog;
