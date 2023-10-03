// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import useOneTapSignin from "@/utils/helpers/useOneTapSignin";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  Text,
  useBreakpoint,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { forwardRef, useEffect, useRef, useState } from "react";
import MySKDark from "@/public/images/brand/mysk-dark.svg";
import MySKLight from "@/public/images/brand/mysk-light.svg";
import cn from "@/utils/helpers/cn";

/**
 * A form for logging in.
 */
const LogInSide: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("landing", { keyPrefix: "main" });

  const sectionRef = useRef<HTMLDivElement>(null);

  const { atBreakpoint } = useBreakpoint();
  const [buttonWidth, setButtonWidth] = useState<number>();

  useOneTapSignin({
    redirect: false,
    parentButtonID: "button-google-sign-in",
    buttonWidth,
  });

  function handleResize() {
    setButtonWidth(
      (sectionRef?.current as HTMLDivElement)?.clientWidth -
        (atBreakpoint === "base" ? 32 : 36),
    );
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={style}
      className={cn(`relative flex flex-col gap-6 bg-surface`, className)}
    >
      {/* Header */}
      <div>
        <MultiSchemeImage
          srcLight={MySKLight}
          srcDark={MySKDark}
          alt={t("logoAlt")}
          className="[&>img]:w-16"
        />
        <Text type="headline-medium" element="h2">
          {t("title")}
        </Text>
      </div>

      {/* Log in with Google */}
      <div className="flex grow flex-col gap-2">
        <div
          id="button-google-sign-in"
          className={cn(`h-[38px] rounded-full [color-scheme:light]
            [&:not(:has(iframe))]:animate-pulse
            [&:not(:has(iframe))]:bg-surface-variant`)}
        />
        <Text type="body-small" element="p" className="mx-4 text-on-surface-variant">
          {t("googleHelper")}
        </Text>
      </div>

      {/* Supplementary actions */}
      <div
        className={cn(`flex flex-col gap-2 [&>*]:!bg-surface-3
          [&>*]:state-layer:!bg-primary`)}
      >
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="help" />}
          href="https://docs.google.com/document/d/1yAEVK09BgbpFIPpG5j1xvfCRUGUdRyL9S1gAxh9UjfU/edit?usp=sharing"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" rel="noreferrer" />
          ))}
        >
          {t("action.help")}
        </Button>
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="report" />}
          href="https://forms.gle/v73WxeTx4hE9fbSX6"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" rel="noreferrer" />
          ))}
        >
          {t("action.report")}
        </Button>
      </div>
    </section>
  );
};

export default LogInSide;
