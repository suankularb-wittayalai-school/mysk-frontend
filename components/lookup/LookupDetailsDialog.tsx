// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { FullscreenDialog } from "@suankularb-components/react";
import { ReactNode } from "react";

const LookupDetailsDialog: StylableFC<{
  children: ReactNode;
  open?: boolean;
  onClose: () => void;
}> = ({ children, open, onClose, style, className }) => {
  return (
    <FullscreenDialog
      open={open}
      title=""
      onClose={onClose}
      className={cn(`[&>:first-child]:!flex-row-reverse
        [&>:first-child]:!bg-transparent [&>:last-child>div]:!mx-0
        [&>:last-child>div]:!rounded-none [&>:last-child>div]:!border-0
        [&>:last-child]:h-[100dvh] [&>:last-child]:!p-0`)}
    >
      {children}
    </FullscreenDialog>
  );
};

export default LookupDetailsDialog;
