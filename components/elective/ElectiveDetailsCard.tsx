import MultilangText from "@/components/common/MultilingualText";
import ChooseButton from "@/components/elective/ChooseButton";
import ElectiveDetailsHeader from "@/components/elective/ElectiveDetailsHeader";
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
import { Actions, ChipSet, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A card similar to a Lookup Details Card that displays details of an Elective
 * Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 * @param enrolledID The session code of the Elective Subject the Student is currently enrolled in.
 * @param onChooseSuccess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ElectiveDetailsCard: StylableFC<{
  electiveSubject: ElectiveSubject | null;
  enrolledID?: number | null;
  onChooseSuccess?: () => void;
}> = ({ electiveSubject, enrolledID, onChooseSuccess, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail" });

  return (
    <section style={style} className={cn(`flex h-full flex-col`, className)}>
      {electiveSubject && (
        <>
          <ElectiveDetailsHeader electiveSubject={electiveSubject} />

          <LookupDetailsContent>
            <div className={cn(`grid grid-cols-2 gap-2 *:bg-surface-bright`)}>
              {/* Subject name */}
              <InformationCard
                title={t("information.name")}
                className="col-span-2"
              >
                <MultilangText text={electiveSubject.name} />
              </InformationCard>

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
            </div>

            {enrolledID !== undefined && (
              <Actions align="full">
                <ChooseButton
                  sessionCode={electiveSubject.session_code}
                  enrolledID={enrolledID}
                  onSucess={onChooseSuccess}
                />
              </Actions>
            )}
          </LookupDetailsContent>
        </>
      )}
    </section>
  );
};

export default ElectiveDetailsCard;
