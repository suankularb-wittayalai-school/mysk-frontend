// Imports
import ClubRegistryLogo from "@/public/images/drawer/club-registry.png";
import KularbFahLogo from "@/public/images/drawer/kularb-fah.png";
import KularbLuangLogo from "@/public/images/drawer/kularb-luang.png";
import LibraryEBookLogo from "@/public/images/drawer/library-ebook.png";
import LibraryOPACLogo from "@/public/images/drawer/library-opac.png";
import LibraryLogo from "@/public/images/drawer/library.png";
import MySKLogo from "@/public/images/drawer/mysk.png";
import SchoolICTLogo from "@/public/images/drawer/school-ict.png";
import ShoppingLogo from "@/public/images/drawer/shopping.png";
import SKACTHLogo from "@/public/images/drawer/sk-ac-th.png";
import { useLocale } from "@/utils/hooks/i18n";
import { StylableFC } from "@/utils/types/common";
import {
  AppDrawerItem,
  AppDrawerSegment,
  AppDrawer as BaseAppDrawer,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

/**
 * A toggle for a drawer of all apps used by Suankularb students and teachers.
 *
 * @returns A Button.
 */
const AppDrawer: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("common", { keyPrefix: "appDrawer" });

  return (
    <BaseAppDrawer locale={locale} style={style} className={className}>
      {/* MySK apps */}
      <AppDrawerSegment title={t("mysk.title")}>
        <AppDrawerItem
          logo={<Image src={MySKLogo} alt="" />}
          name={t("mysk.mysk")}
          href="https://www.mysk.school/"
        />
        <AppDrawerItem
          logo={<Image src={ClubRegistryLogo} alt="" />}
          name={t("mysk.clubRegistry")}
          href="https://clubs.mysk.school/"
        />
      </AppDrawerSegment>

      {/* School apps */}
      <AppDrawerSegment title={t("school.title")}>
        <AppDrawerItem
          logo={<Image src={SKACTHLogo} alt="" />}
          name={t("school.skAcTh")}
          href="http://www.sk.ac.th/"
        />
        <AppDrawerItem
          logo={<Image src={KularbFahLogo} alt="" />}
          name={t("school.kularbFah")}
          href="https://store.kularbfah-online.sk.ac.th/browse"
        />
        <AppDrawerItem
          logo={<Image src={KularbLuangLogo} alt="" />}
          name={t("school.kularbLuang")}
          href="https://sites.google.com/sk.ac.th/standard11suan"
        />
        <AppDrawerItem
          logo={<Image src={ShoppingLogo} alt="" />}
          name={t("school.shopping")}
          href="https://shopping.skkornor.org/"
        />
        <AppDrawerItem
          logo={<Image src={LibraryLogo} alt="" />}
          name={t("school.library")}
          href="http://library.sk.ac.th/"
        />
        <AppDrawerItem
          logo={<Image src={LibraryEBookLogo} alt="" />}
          name={t("school.libraryEBook")}
          href="http://sk.vlcloud.net/"
        />
        <AppDrawerItem
          logo={<Image src={LibraryOPACLogo} alt="" />}
          name={t("school.libraryOPAC")}
          href="http://library.sk.ac.th/openbib/opac/index.php"
        />
      </AppDrawerSegment>

      {/* Other apps */}
      <AppDrawerSegment title={t("other.title")}>
        <AppDrawerItem
          logo={<Image src={SchoolICTLogo} alt="" />}
          name={t("other.schoolICT")}
          href="https://fin.sch.cloud/sk"
        />
      </AppDrawerSegment>
    </BaseAppDrawer>
  );
};

export default AppDrawer;
