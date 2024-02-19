import cn from "@/utils/helpers/cn";
import { Button, Dialog, MaterialIcon } from "@suankularb-components/react";
import { omit } from "radash";
import { ComponentProps, FC } from "react";

/**
 * A Dialog with a close Button fixed to the top-right. Useful for creating
 * Dialogs that isn’t primarily text-based, like an image or an ID card.
 * 
 * Props are the same as that of SKCom”s Dialog.
 */
const ArtDialog: FC<ComponentProps<typeof Dialog>> = (props) => (
  <Dialog {...omit(props, ["children"])}>
    {props.children}
    <Button
      appearance="text"
      onClick={props.onClose}
      icon={<MaterialIcon icon="close" />}
      className={cn(`!absolute !right-3 !top-3 z-[90] !text-on-surface
        state-layer:!bg-on-surface`)}
    />
  </Dialog>
);

export default ArtDialog;
