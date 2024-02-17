import ArtDialog from "@/components/common/ArtDialog";
import SakeBackground from "@/components/home/sake/SakeBackground";
import SakeImage from "@/public/images/home/sake.png";
import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * A celebration of Sake’s birthday, displayed on every February 19th. Also a
 * parody of those pop-ups celebrating holidays you see on Thai websites.
 */
const SakeCelebration: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("home", { keyPrefix: "dialog.sakeCelebration" });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Only celebrate Sake on February 19th.
    if (getISODateString(new Date()).slice(5) !== "02-19") return; // MM-DD

    // Check if Sake Celebration has been activated before.
    const lastShown = localStorage.getItem("lastSakeCelebration");
    if (
      // If it hasn’t been activated before...
      !lastShown ||
      // ...or if it has been activated but not this year,
      Number(lastShown.slice(0, 4)) !== new Date().getFullYear()
    ) {
      // ...display the Sake Celebration.
      timer = setTimeout(() => setOpen(true), 1000);
      localStorage.setItem("lastSakeCelebration", getISODateString(new Date()));
      return;
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <ArtDialog
      open={open}
      width={560}
      onClose={() => setOpen(false)}
      style={style}
      className={cn(`isolate h-64 overflow-hidden`, className)}
    >
      <SakeBackground className="absolute inset-0 -z-10" />
      <Image
        src={SakeImage}
        alt={t("headshotAlt")}
        className="absolute right-0 h-full w-auto"
      />
      <div className="flex h-full flex-col p-6 pr-56 text-on-surface-variant">
        <Text type="body-large" element="p">
          {t("body", {
            year: getLocaleYear(locale, new Date().getFullYear(), "AD"),
          })}
        </Text>
        <div aria-hidden className="grow" />
        <Text type="title-medium" element="p">
          {t("closing")}
        </Text>
        <Text type="body-medium" element="p">
          {t("signature")}
        </Text>
      </div>
    </ArtDialog>
  );
};

export default SakeCelebration;
