// Imports
import { Student, Teacher } from "@/utils/types/person";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import Link from "next/link";
import { FC, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import TopUpQRDialog from "@/components/club/home/TopUpQRDialog";

const HomeHeader: FC<{ user: Student | Teacher; isKornor: boolean }> = ({
  user,
  isKornor,
}) => {
  const { t } = useTranslation("club");

  const [QRDialogOpen, setQRDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col gap-8 sm:col-span-2 md:col-span-1">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:contents">
          {isKornor ? (
            <>
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="card_giftcard" />}
                href="/club/manage/kornor/qr"
                element={Link}
              >
                Top Up
              </Button>
              <Button
                appearance="tonal"
                icon={<MaterialIcon icon="shield_person" />}
                href="/club/manage/kornor"
                element={Link}
              >
                Admin Pannel
              </Button>
            </>
          ) : (
            <>
              <Card appearance="filled">
                <CardHeader
                  title={
                    <p>
                      You can join <span className="text-primary">5</span> more
                      clubs.
                    </p>
                  }
                />
                <CardContent>
                  <span>You can top up at the Kornor's booth</span>
                  <Button
                    appearance="tonal"
                    onClick={() => setQRDialogOpen(true)}
                  >
                    Top up
                  </Button>
                </CardContent>
              </Card>
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="qr_code_scanner" />}
                href="/club/join/qr"
                element={Link}
              >
                {t("action.join")}
              </Button>
            </>
          )}
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
