// Imports
import { Club } from "@/utils/types/club";
import { Student } from "@/utils/types/person";
import { Button, MaterialIcon } from "@suankularb-components/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { useTranslation } from "next-i18next";

const HomeHeader: FC<{
  user: Student;
  managingClubs: Club[];
}> = ({ user, managingClubs }) => {
  const { t } = useTranslation("index", { keyPrefix: "header" });
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 sm:col-span-2 md:col-span-1">
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:contents">
        {/* Add Kornor Admin Pannel and Manage Clubs Button here */}
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="qr_code_scanner" />}
          onClick={() => router.replace("/club/join/qr")}
        >
          {t("action.join")}
        </Button>
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="map" />}
          href="/club/explore"
          element={Link}
        >
          {t("action.explore")}
        </Button>
      </div>
    </div>
  );
};

export default HomeHeader;
