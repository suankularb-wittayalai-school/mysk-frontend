// External libraries
import Image from "next/image";
import { useTranslation } from "next-i18next";

const PrintHeader = ({ title }: { title: string }): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <div
      aria-hidden
      className="mb-2 hidden flex-row items-center gap-4 print:flex"
    >
      <div className="relative h-20 w-20">
        <Image
          alt={t("brand.logoAlt", { ns: "common" })}
          layout="fill"
          priority={true}
          src="/images/branding/logo-black.svg"
        />
      </div>
      <div className="font-display leading-tight">
        <div className="text-4xl font-bold">{title}</div>
        <div className="text-xl font-light">{t("brand.sloganShort")}</div>
      </div>
    </div>
  );
};

export default PrintHeader;
