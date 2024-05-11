import { GSIStatus } from "@/pages";
import useOneTapSignin from "@/utils/helpers/account/useOneTapSignin";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { useEffect, useRef, useState } from "react";

/**
 * A Google Sign In Button.
 *
 * @param onStateChange Triggers when the button's state changes. Passes the new state as the `GSIStatus` enum.
 * @param onNotFound Triggers when the account is not found.
 */
const GSIButton: StylableFC<{
  onStateChange?: (state: GSIStatus) => void;
  onNotFound?: () => void;
}> = ({ onStateChange, onNotFound, style, className }) => {
  const [buttonWidth, setButtonWidth] = useState<number>();

  const buttonRef = useRef<HTMLDivElement>(null);
  function handleResize() {
    setButtonWidth((buttonRef?.current as HTMLDivElement)?.clientWidth);
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useOneTapSignin({
    redirect: false,
    parentButtonID: "button-google-sign-in",
    buttonWidth,
    onStateChange,
    onNotFound,
  });

  return (
    <div
      ref={buttonRef}
      id="button-google-sign-in"
      style={style}
      className={cn(
        `h-[38px] rounded-full [color-scheme:light]
        [&:not(:has(iframe))]:animate-pulse
        [&:not(:has(iframe))]:bg-surface-variant`,
        className,
      )}
    />
  );
};

export default GSIButton;
