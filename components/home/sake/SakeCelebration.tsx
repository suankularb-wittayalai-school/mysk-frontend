import ArtDialog from "@/components/common/ArtDialog";
import SakeBackground from "@/components/home/sake/SakeBackground";
import SakeImage from "@/public/images/home/sake.png";
import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
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
      return;
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <ArtDialog
      open={open}
      width={560}
      onClose={() => {
        setOpen(false);
        // Save the date of the last activation so as to not show it again this
        // year.
        localStorage.setItem(
          "lastSakeCelebration",
          getISODateString(new Date()),
        );
      }}
      style={style}
      className={cn(`isolate overflow-hidden sm:h-64`, className)}
    >
      <SakeBackground className="absolute inset-0 left-auto right-0 -z-10" />
      <Image
        src={SakeImage}
        alt={t("headshotAlt")}
        className="absolute right-0 top-0 h-64 w-auto"
      />
      <div
        className={cn(`mt-64 flex h-full flex-col rounded-tl-[inherit]
          bg-surface p-6 text-on-surface sm:mt-0 sm:rounded-none
          sm:bg-transparent sm:pr-56 sm:text-on-surface-variant`)}
      >
        <Text type="body-large" element="p">
          {t("body", {
            year: getLocaleYear("th", new Date().getFullYear(), "AD"),
          })}
        </Text>
        <div aria-hidden className="min-h-4 grow" />
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
