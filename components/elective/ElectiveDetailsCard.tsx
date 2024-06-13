import MultilangText from "@/components/common/MultilingualText";
import ChooseButton from "@/components/elective/ChooseButton";
import ElectiveDetailsHeader from "@/components/elective/ElectiveDetailsHeader";
import ElectiveStudentList from "@/components/elective/ElectiveStudentList";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import PeopleChipSet from "@/components/person/PeopleChipSet";
import RoomChip from "@/components/room/RoomChip";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  ChipSet,
  MaterialIcon,
  Search,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";
import shortUUID from "short-uuid";

/**
 * A card similar to a Lookup Details Card that displays details of an Elective
 * Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 * @param enrolledElective The session code of the Elective Subject the Student is currently enrolled in.
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 * @param onChooseSuccess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ElectiveDetailsCard: StylableFC<{
  electiveSubject: ElectiveSubject | null;
  enrolledElective?: ElectiveSubject | null;
  inEnrollmentPeriod?: boolean;
  onChooseSuccess?: () => void;
}> = ({
  electiveSubject,
  enrolledElective,
  inEnrollmentPeriod,
  onChooseSuccess,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail" });

  const { fromUUID } = shortUUID();

  const [query, setQuery] = useState("");

  return (
    <section style={style} className={cn(`flex flex-col`, className)}>
      {electiveSubject && (
        <>
          <ElectiveDetailsHeader electiveSubject={electiveSubject} />

          <LookupDetailsContent className="!rounded-xl pb-28 md:pb-4">
            <div className="grid grid-cols-2 gap-2">
              {/* Subject name */}
              <Card appearance="filled" className="col-span-2 sm:col-span-1">
                <CardHeader title={t("information.name")} />
                <CardContent>
                  <MultilangText text={electiveSubject.name} />
                </CardContent>
              </Card>

              {/* Subject code */}
              <Card appearance="filled">
                <CardHeader title={t("information.code")} />
                <CardContent>
                  <MultilangText text={electiveSubject.code} />
                </CardContent>
              </Card>

              {/* Teachers */}
              <Card appearance="filled">
                <CardHeader title={t("information.teachers")} />
                <CardContent>
                  <PeopleChipSet
                    people={electiveSubject.teachers.map((teacher) => ({
                      ...teacher,
                      role: UserRole.teacher,
                    }))}
                    scrollable
                    className="fade-out-to-r -mx-3 pb-1 *:pl-3 *:pr-8"
                  />
                </CardContent>
              </Card>

              {/* Room */}
              {electiveSubject.room && (
                <Card appearance="filled">
                  <CardHeader title={t("information.room")} />
                  <CardContent>
                    <ChipSet
                      scrollable
                      className="fade-out-to-r -mx-3 pb-1 *:pl-3 *:pr-8"
                    >
                      {electiveSubject.room.split(", ").map((room) => (
                        <RoomChip key={room} room={room} />
                      ))}
                    </ChipSet>
                  </CardContent>
                </Card>
              )}
            </div>

            {electiveSubject.description?.th && (
              <section className="space-y-1">
                <Text type="title-medium" element="h3">
                  {t("information.description")}
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

            <section className="space-y-2 md:hidden">
              <div className="flex h-4 flex-row items-center">
                <Text type="title-medium" element="h3" className="grow">
                  {t("students.title")}
                </Text>
                <Button
                  appearance="text"
                  icon={<MaterialIcon icon="print" />}
                  href={`/teach/electives/${fromUUID(electiveSubject.id)}/print`}
                  element={Link}
                >
                  {t("students.action.print")}
                </Button>
              </div>
              <Search
                value={query}
                alt={t("students.searchAlt")}
                onChange={setQuery}
                locale={locale}
              />
              <ElectiveStudentList
                electiveSubject={electiveSubject}
                query={query}
              />
            </section>

            {inEnrollmentPeriod && enrolledElective !== undefined && (
              <div
                className={cn(`pointer-events-none fixed inset-0 top-auto z-10
                  overflow-hidden bg-gradient-to-t from-surface-container p-4
                  pt-12 sm:pointer-events-auto sm:rounded-b-xl`)}
              >
                <Actions
                  align="full"
                  className={cn(`pointer-events-auto rounded-full
                    bg-surface-container`)}
                >
                  <ChooseButton
                    electiveSubject={electiveSubject}
                    enrolledElective={enrolledElective}
                    onSucess={onChooseSuccess}
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
