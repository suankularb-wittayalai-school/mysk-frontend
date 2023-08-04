// Imports
import AppDrawerItem from "@/components/common/AppDrawerItem";
import AppDrawerSegment from "@/components/common/AppDrawerSegment";
import ClubRegistryLogo from "@/public/images/drawer/club-registry.png";
import KularbFahLogo from "@/public/images/drawer/kularb-fah.png";
import KularbLuangLogo from "@/public/images/drawer/kularb-luang.png";
import LibraryEBookLogo from "@/public/images/drawer/library-ebook.png";
import LibraryOPACLogo from "@/public/images/drawer/library-opac.png";
import LibraryLogo from "@/public/images/drawer/library.png";
import MySKLogo from "@/public/images/drawer/mysk.png";
import SchoolICTLogo from "@/public/images/drawer/school-ict.png";
import SKACTHLogo from "@/public/images/drawer/sk-ac-th.png";
import { useToggle } from "@/utils/hooks/toggle";
import {
  Button,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import va from "@vercel/analytics";

/**
 * A toggle for a drawer of all apps used by Suankularb students and teachers.
 *
 * @returns A Button.
 */
const AppDrawer: FC = () => {
  const { t } = useTranslation("common", { keyPrefix: "pageHeader.appDrawer" });

  const [drawerOpen, toggleDrawer] = useToggle();
  const { duration, easing } = useAnimationConfig();

  return (
    <div className="relative">
      {/* Toggle */}
      <Button
        appearance="text"
        icon={<MaterialIcon icon="apps" />}
        onClick={() => {
          if (!drawerOpen) va.track("Open App Drawer");
          toggleDrawer();
        }}
        className="!z-[85]"
      >
        {t("toggle")}
      </Button>

      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="skc-scrim !z-[80]"
              transition={transition(duration.medium2, easing.standard)}
              onClick={toggleDrawer}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "-50%", scaleY: 0 }}
              animate={{ y: 20, scaleY: 1 }}
              exit={{
                y: "-50%",
                scaleY: 0,
                transition: transition(
                  duration.short2,
                  easing.standardAccelerate,
                ),
              }}
              transition={transition(
                duration.medium4,
                easing.standardDecelerate,
              )}
              style={{ borderRadius: 16 }}
              className="absolute right-0 top-8 z-[85] w-[20.25rem] divide-y-1
                divide-outline rounded-lg bg-surface-1 text-on-surface shadow-1"
            >
              {/* MySK apps */}
              <AppDrawerSegment title={t("mysk.title")}>
                <AppDrawerItem
                  src={MySKLogo}
                  name={t("mysk.mysk")}
                  href="https://www.mysk.school/"
                />
                <AppDrawerItem
                  src={ClubRegistryLogo}
                  name={t("mysk.clubRegistry")}
                  href="https://clubs.mysk.school/"
                />
              </AppDrawerSegment>

              {/* School apps */}
              <AppDrawerSegment title={t("school.title")}>
                <AppDrawerItem
                  src={SKACTHLogo}
                  name={t("school.skAcTh")}
                  href="http://www.sk.ac.th/"
                />
                <AppDrawerItem
                  src={KularbFahLogo}
                  name={t("school.kularbFah")}
                  href="https://store.kularbfah-online.sk.ac.th/browse"
                />
                <AppDrawerItem
                  src={KularbLuangLogo}
                  name={t("school.kularbLuang")}
                  href="https://sites.google.com/sk.ac.th/standard11suan"
                />
                <AppDrawerItem
                  src={LibraryLogo}
                  name={t("school.library")}
                  href="http://library.sk.ac.th/"
                />
                <AppDrawerItem
                  src={LibraryEBookLogo}
                  name={t("school.libraryEBook")}
                  href="http://sk.vlcloud.net/"
                />
                <AppDrawerItem
                  src={LibraryOPACLogo}
                  name={t("school.libraryOPAC")}
                  href="http://library.sk.ac.th/openbib/opac/index.php"
                />
              </AppDrawerSegment>

              {/* Other apps */}
              <AppDrawerSegment title={t("other.title")}>
                <AppDrawerItem
                  src={SchoolICTLogo}
                  name={t("other.schoolICT")}
                  href="https://fin.sch.cloud/sk"
                />
              </AppDrawerSegment>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppDrawer;
