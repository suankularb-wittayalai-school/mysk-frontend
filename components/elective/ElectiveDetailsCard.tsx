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
 * @param enrolledElective The session code of the Elective Subject the Student is currently enrolled in.
 * @param onChooseSuccess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ElectiveDetailsCard: StylableFC<{
  electiveSubject: ElectiveSubject | null;
  enrolledElective?: ElectiveSubject | null;
  onChooseSuccess?: () => void;
}> = ({
  electiveSubject,
  enrolledElective,
  onChooseSuccess,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail.information" });

  return (
    <section style={style} className={cn(`flex flex-col`, className)}>
      {electiveSubject && (
        <>
          <ElectiveDetailsHeader electiveSubject={electiveSubject} />

          <LookupDetailsContent className="!rounded-xl pb-28 md:pb-4">
            <div className={cn(`grid grid-cols-2 gap-2 *:bg-surface-bright`)}>
              {/* Subject name */}
              <InformationCard
                title={t("name")}
                className="col-span-2 sm:col-span-1"
              >
                <MultilangText text={electiveSubject.name} />
              </InformationCard>

              {/* Subject code */}
              <InformationCard title={t("code")}>
                <MultilangText text={electiveSubject.code} />
              </InformationCard>

              {/* Teachers */}
              <InformationCard title={t("teachers")}>
                <PeopleChipSet
                  people={electiveSubject.teachers.map((teacher) => ({
                    ...teacher,
                    role: UserRole.teacher,
                  }))}
                  scrollable
                  className="fade-out-to-r -mx-3 pb-1 *:pl-3 *:pr-8"
                />
              </InformationCard>

              {/* Room */}
              {electiveSubject.room && (
                <InformationCard title={t("room")}>
                  <ChipSet
                    scrollable
                    className="fade-out-to-r -mx-3 pb-1 *:pl-3 *:pr-8"
                  >
                    {electiveSubject.room.split(", ").map((room) => (
                      <RoomChip key={room} room={room} />
                    ))}
                  </ChipSet>
                </InformationCard>
              )}
            </div>

            {electiveSubject.description?.th && (
              <section className="space-y-1">
                <Text type="title-medium" element="h3">
                  {t("description")}
                </Text>
                <Text
                  type="body-medium"
                  element="p"
                  className="!leading-normal text-on-surface-variant"
                >
                  {getLocaleString(electiveSubject.description, locale)}
                </Text>
              </section>
            )}

            {enrolledElective !== undefined && (
              <div
                className={cn(`pointer-events-none fixed inset-0 top-auto z-10
                  overflow-hidden bg-gradient-to-t from-surface-container p-4
                  pt-12 sm:rounded-b-xl`)}
              >
                <Actions
                  align="full"
                  className="rounded-full bg-surface-container"
                >
                  <ChooseButton
                    electiveSubject={electiveSubject}
                    enrolledElective={enrolledElective}
                    onSucess={onChooseSuccess}
                    className="!pointer-events-auto"
                  />
                </Actions>
              </div>
            )}
          </LookupDetailsContent>
        </>
      )}
    </section>
  );
};

export default ElectiveDetailsCard;
