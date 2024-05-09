import ClubRegistryLogo from "@/public/images/drawer/club-registry.svg";
import ITALogo from "@/public/images/drawer/ita.png";
import KularbFahLogo from "@/public/images/drawer/kularb-fah.svg";
import KularbLuangLogo from "@/public/images/drawer/kularb-luang.png";
import LibraryEBookLogo from "@/public/images/drawer/library-ebook.png";
import LibraryOPACLogo from "@/public/images/drawer/library-opac.png";
import LibraryLogo from "@/public/images/drawer/library.svg";
import MainSiteLogo from "@/public/images/drawer/main-site.png";
import MySKLogo from "@/public/images/drawer/mysk.svg";
import SamakLogo from "@/public/images/drawer/samak.svg";
import SARLogo from "@/public/images/drawer/sar.png";
import SchoolICTLogo from "@/public/images/drawer/school-ict.png";
import ShoppingLogo from "@/public/images/drawer/shopping.svg";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  AppDrawerItem,
  AppDrawerSegment,
  AppDrawer as BaseAppDrawer,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import Image from "next/image";

/**
 * A toggle for a drawer of all apps used by Suankularb students and teachers.
 *
 * @returns A Button.
 */
const AppDrawer: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("common", { keyPrefix: "appDrawer" });

  const plausible = usePlausible();

  /**
   * Track an app open event.
   *
   * @param app The name of the app.
   */
  function trackAppOpen(app: string) {
    plausible("Open App in App Drawer", { props: { app } });
  }

  return (
    <BaseAppDrawer
      locale={locale}
      onOpen={() => plausible("Open App Drawer")}
      style={style}
      className={className}
    >
      {/* MySK apps */}
      <AppDrawerSegment title={t("mysk.title")}>
        <AppDrawerItem
          logo={<Image src={MySKLogo} alt="" />}
          name={t("mysk.mysk")}
          onClick={() => trackAppOpen("MySK")}
          href="https://www.mysk.school/"
        />
        <AppDrawerItem
          logo={<Image src={ClubRegistryLogo} alt="" />}
          name={t("mysk.clubRegistry")}
          onClick={() => trackAppOpen("MySK Club Registry")}
          href="https://clubs.mysk.school/"
        />
      </AppDrawerSegment>

      {/* School apps */}
      <AppDrawerSegment title={t("school.title")}>
        <AppDrawerItem
          logo={<Image src={MainSiteLogo} alt="" />}
          name={t("school.mainSite")}
          onClick={() => trackAppOpen("sk.ac.th")}
          href="http://www.sk.ac.th/"
        />
        <AppDrawerItem
          logo={<Image src={SamakLogo} alt="" />}
          name={t("school.samak")}
          onClick={() => trackAppOpen("Samak")}
          href="http://samak.sk.ac.th/"
        />
        <AppDrawerItem
          logo={<Image src={ShoppingLogo} alt="" />}
          name={t("school.shopping")}
          onClick={() => trackAppOpen("SK Shopping")}
          href="https://shopping.skkornor.org/"
        />
        <AppDrawerItem
          logo={<Image src={SchoolICTLogo} alt="" />}
          name={t("school.schoolICT")}
          onClick={() => trackAppOpen("School ICT")}
          href="https://fin.sch.cloud/sk"
        />
        <AppDrawerItem
          logo={<Image src={SARLogo} alt="" />}
          name={t("school.sar")}
          onClick={() => trackAppOpen("SAR")}
          href="http://161.82.218.12/sksar"
        />
        <AppDrawerItem
          logo={<Image src={ITALogo} alt="" />}
          name={t("school.ita")}
          onClick={() => trackAppOpen("ITA")}
          href="https://sites.google.com/sk.ac.th/oit"
        />
        <AppDrawerItem
          logo={<Image src={KularbLuangLogo} alt="" />}
          name={t("school.basedLine")}
          onClick={() => trackAppOpen("Based Line")}
          href="http://43.229.77.153/~ztrad/sk/"
        />
        <AppDrawerItem
          logo={<Image src={KularbLuangLogo} alt="" />}
          name={t("school.kularbLuang")}
          onClick={() => trackAppOpen("Kularb Luang")}
          href="https://sites.google.com/sk.ac.th/standard11suan"
        />
      </AppDrawerSegment>

      {/* Learning apps */}
      <AppDrawerSegment title={t("learning.title")}>
        <AppDrawerItem
          logo={<Image src={KularbFahLogo} alt="" />}
          name={t("learning.kularbFah")}
          onClick={() => trackAppOpen("Kularb Fah")}
          href="https://store.kularbfah-online.sk.ac.th/browse"
        />
        <AppDrawerItem
          logo={<Image src={LibraryLogo} alt="" />}
          name={t("learning.library")}
          onClick={() => trackAppOpen("Library")}
          href="http://library.sk.ac.th/"
        />
        <AppDrawerItem
          logo={<Image src={LibraryEBookLogo} alt="" />}
          name={t("learning.libraryEBook")}
          onClick={() => trackAppOpen("Library E-book")}
          href="http://sk.vlcloud.net/"
        />
        <AppDrawerItem
          logo={<Image src={LibraryOPACLogo} alt="" />}
          name={t("learning.libraryOPAC")}
          onClick={() => trackAppOpen("Library OPAC")}
          href="http://library.sk.ac.th/openbib/opac/index.php"
        />
      </AppDrawerSegment>
    </BaseAppDrawer>
  );
};

export default AppDrawer;
