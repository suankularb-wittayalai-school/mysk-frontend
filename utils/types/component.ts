// Imports
import { DialogProps } from "@suankularb-components/react";
import { FC, CSSProperties } from "react";

/**
 * A functional component that can be styled with `className` and `styles`.
 */
export type StylableFC<Props extends {} = {}> = FC<
  Props & { className?: string; style?: CSSProperties }
>;

/**
 * A function component with props passed onto Dialog.
 */
export type DialogFC<Props extends {} = {}> = FC<
Props & Pick<DialogProps, "open" | "onClose">
>;
