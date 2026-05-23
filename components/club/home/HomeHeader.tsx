// Imports
import { Student, Teacher } from "@/utils/types/person";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import Link from "next/link";
import { FC, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import TopUpQRDialog from "@/components/club/home/TopUpQRDialog";
import cn from "@/utils/helpers/cn";

const HomeHeader: FC<{
  user: Student | Teacher;
  isKornor: boolean;
  clubQuotas: number;
}> = ({ user, isKornor, clubQuotas }) => {
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
                {t("topUp.action.openTopUp")}
              </Button>
              <Button
                appearance="tonal"
                icon={<MaterialIcon icon="shield_person" />}
                href="/club/manage/kornor"
                element={Link}
              >
                {t("topUp.action.openAdmin")}
              </Button>
            </>
          ) : (
            <>
              <Card appearance="filled">
                <CardHeader
                  title={
                    <Trans
                      i18nKey="topUp.title"
                      ns="club"
                      values={{ number: clubQuotas }}
                      components={{
                        0: (
                          <Text
                            type="headline-small"
                            className={cn(
                              `${clubQuotas <= 0 ? "text-error" : "text-primary"}`,
                            )}
                          >
                            {null}
                          </Text>
                        ),
                      }}
                    />
                  }
                />
                <CardContent>
                  <Text type="body-medium">{t("topUp.desc")}</Text>
                  <Button
                    appearance="tonal"
                    onClick={() => setQRDialogOpen(true)}
                  >
                    {t("topUp.action.openTopUp")}
                  </Button>
                </CardContent>
              </Card>
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="qr_code_scanner" />}
                href="/club/join/qr"
                disabled={clubQuotas <= 0}
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
