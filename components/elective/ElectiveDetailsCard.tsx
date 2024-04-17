import MultilangText from "@/components/common/MultilingualText";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import InformationCard from "@/components/lookup/people/InformationCard";
import PeopleChipSet from "@/components/person/PeopleChipSet";
import RoomChip from "@/components/room/RoomChip";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import {
  ChipSet,
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A card similar to a Lookup Details Card that displays details of an Elective
 * Subject.
 *
 * @todo Should accept `electiveSubject` prop.
 */
const ElectiveDetailsCard: StylableFC<{
  electiveSubject: ElectiveSubject | null;
}> = ({ electiveSubject, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail" });

  return (
    <section style={style} className={cn(`flex flex-col`, className)}>
      {electiveSubject && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(DURATION.medium2, EASING.standard)}
            className="px-6 pb-3 pt-[1.125rem]"
          >
            <Text type="headline-small" element="h2">
              {getLocaleString(electiveSubject.name, locale)}
            </Text>
          </motion.div>

          <LookupDetailsContent>
            <div className="grid grid-cols-2 gap-2 *:bg-surface-bright md:grid-cols-4">
              {/* Subject name */}
              <InformationCard
                title={t("information.name")}
                className="col-span-2"
              >
                <MultilangText text={electiveSubject.name} />
              </InformationCard>

              {/* Description */}
              {electiveSubject.description?.th && (
                <InformationCard
                  title={t("information.description")}
                  className="col-span-2"
                >
                  {getLocaleString(electiveSubject.description, locale)}
                </InformationCard>
              )}

              {/* Subject code */}
              <InformationCard title={t("information.code")}>
                <MultilangText text={electiveSubject.code} />
              </InformationCard>

              {/* Teachers */}
              <InformationCard title={t("information.teachers")}>
                <PeopleChipSet
                  people={electiveSubject.teachers.map((teacher) => ({
                    ...teacher,
                    role: UserRole.teacher,
                  }))}
                  scrollable
                  className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
                />
              </InformationCard>

              {/* Room */}
              {electiveSubject.room && (
                <InformationCard title={t("information.room")}>
                  <ChipSet
                    scrollable
                    className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
                  >
                    <RoomChip room={electiveSubject.room} />
                  </ChipSet>
                </InformationCard>
              )}

              {/* Credit */}
              <InformationCard title={t("information.credit")}>
                {electiveSubject.credit.toFixed(1)}
              </InformationCard>
            </div>
          </LookupDetailsContent>
        </>
      )}
    </section>
  );
};

export default ElectiveDetailsCard;
