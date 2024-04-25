import PersonAvatar from "@/components/common/PersonAvatar";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Student } from "@/utils/types/person";
import { Text } from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";

const TradeOfferParticipant: StylableFC<{
  participant: Student;
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, participant, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });

  const mysk = useMySKClient();
  const name = getLocaleName(locale, participant, {
    lastName: locale !== "th" ? "abbr" : true,
  });

  return (
    <div
      style={style}
      className={cn(`flex flex-row items-center gap-3`, className)}
    >
      <PersonAvatar {...participant} expandable size={40} />
      <div className="grid *:truncate">
        <Text type="title-medium">
          {mysk.person?.id === participant.id ? (
            <Trans i18nKey="you" t={t} values={{ name }}>
              <span className="text-on-surface-variant" />
            </Trans>
          ) : (
            name
          )}
        </Text>
        <Text type="body-medium" className="text-on-surface-variant">
          {getLocaleString(electiveSubject.name, locale)}
        </Text>
      </div>
    </div>
  );
};

export default TradeOfferParticipant;
