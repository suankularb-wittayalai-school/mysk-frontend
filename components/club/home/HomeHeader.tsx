// Imports
import { Student, Teacher } from "@/utils/types/person";
import { Button, MaterialIcon } from "@suankularb-components/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import TopUpQRDialog from "./TopUpQRDialog";

const HomeHeader: FC<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("index", { keyPrefix: "header" });
  const router = useRouter();

  const [QRDialogOpen, setQRDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col gap-8 sm:col-span-2 md:col-span-1">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:contents">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="qr_code_scanner" />}
            onClick={() => router.replace("/club/join/qr")}
          >
            {t("action.join")}
          </Button>
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="redeem" />}
            onClick={() => setQRDialogOpen(true)}
          >
            Top Up (Placeholder)
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
      {QRDialogOpen && (
        <TopUpQRDialog
          open={true}
          onClose={() => {
            setQRDialogOpen(false);
          }}
          user={user}
        />
      )}
    </>
  );
};

export default HomeHeader;
