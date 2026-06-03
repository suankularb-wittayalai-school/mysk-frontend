// Imports
import cn from "@/utils/helpers/cn";
import { Button, ButtonProps } from "@suankularb-components/react";
import { FC } from "react";

/**
 * A filled Button with a tint for better contrast with the label.
 *
 * @returns A Button.
 */
const TintedFilledButton: FC<
  Omit<ButtonProps, "appearance"> & { tinted?: boolean }
> = (props) => (
  <Button
    {...props}
    appearance="filled"
    className={cn(
      props.tinted &&
        `after:absolute after:inset-0 after:bg-on-surface after:opacity-10 [&>*]:z-10`,
      props.className,
    )}
  />
);

export default TintedFilledButton;
