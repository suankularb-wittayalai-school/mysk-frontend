import PersonAvatar from "@/components/common/PersonAvatar";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Student } from "@/utils/types/person";
import {
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

/**
 * A participant (sender or receiver) in a Trade Offer.
 *
 * @param participant The Student to display.
 * @param electiveSubject The Elective Subject the Student is offering.
 */
const TradeOfferParticipant: StylableFC<{
  participant: Student;
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, participant, style, className }) => {
  const locale = useLocale();

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
            <Trans
              i18nKey="elective/detail/trade:you"
              values={{ name }}
              components={{
                0: <span className="text-on-surface-variant" />,
              }}
            ></Trans>
          ) : (
            name
          )}
        </Text>
        <Text
          type="body-medium"
          element={(props) => (
            <motion.span
              layout="position"
              layoutId={electiveSubject.session_code}
              transition={transition(DURATION.long2, EASING.emphasized)}
              {...props}
            />
          )}
          className="block text-on-surface-variant"
        >
          {getLocaleString(electiveSubject.name, locale)}
        </Text>
      </div>
    </div>
  );
};

export default TradeOfferParticipant;
