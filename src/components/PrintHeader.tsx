// External libraries
import Image from "next/image";
import { useTranslation } from "next-i18next";

const PrintHeader = ({ title }: { title: string }): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <div aria-hidden className="hidden flex-row gap-4 print:flex mb-2 items-center">
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
        <div className="text-xl font-light">ระบบจัดการการศึกษา MySK</div>
      </div>
    </div>
  );
};

export default PrintHeader;
