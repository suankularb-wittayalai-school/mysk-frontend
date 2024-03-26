import cn from "@/utils/helpers/cn";
import useOneTapSignin from "@/utils/helpers/useOneTapSignin";
import { StylableFC } from "@/utils/types/common";
import { useEffect, useRef, useState } from "react";

/**
 * A Google Sign In Button.
 *
 * @param onClick Triggers when the button is clicked.
 */
const GSIButton: StylableFC<{
  onClick?: () => void;
}> = ({ onClick, style, className }) => {
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
  });

  return (
    <div
      ref={buttonRef}
      id="button-google-sign-in"
      onClick={onClick}
      style={style}
      className={cn(
        `h-[44px] rounded-full [color-scheme:light]
        [&:not(:has(iframe))]:animate-pulse
        [&:not(:has(iframe))]:bg-surface-variant`,
        className,
      )}
    />
  );
};

export default GSIButton;
