// Imports
import ContactCard from "@/components/account/ContactCard";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import ClassHeader from "@/components/lookup/classes/ClassHeader";
import InformationCard from "@/components/lookup/teachers/InformationCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Columns, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Lookup Detail Card that displays details of a Classroom.
 *
 * @param classroom The Classroom to display details for.
 * @param teacherID The ID of the Teacher currently logged in, if the user is a Teacher. Used for Attendance.
 * @param isOwnClass Whether the Classroom belongs to the current user.
 * @param role The role of the current user.
 */
const ClassDetailsCard: StylableFC<{
  classroom?: Omit<Classroom, "students" | "year" | "subjects">;
  teacherID?: string;
  isOwnClass?: boolean;
  role: UserRole;
}> = ({ classroom, teacherID, isOwnClass, role, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "classes.detail" });

  return (
    <LookupDetailsCard style={style} className={className}>
      {classroom && (
        <>
          <ClassHeader
            classroom={classroom}
            teacherID={teacherID}
            isOwnClass={isOwnClass}
            role={role}
          />
          <LookupDetailsContent>
            <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {/* Class advisors */}
              <InformationCard
                title={t("general.classAdvisors")}
                className="col-span-2"
              >
                <ul className="list-disc pb-1 pl-6">
                  {classroom.class_advisors.map((advisor) => (
                    <li key={advisor.id}>
                      {getLocaleName(locale, advisor, { prefix: "teacher" })}
                    </li>
                  ))}
                </ul>
              </InformationCard>

              {/* Room */}
              <InformationCard title={t("general.room")}>
                {classroom.main_room}
              </InformationCard>
            </section>

            {classroom.contacts.length > 0 && (
              <section className="space-y-2">
                <Text
                  type="title-medium"
                  element="h3"
                  className="rounded-md bg-surface px-3 py-2"
                >
                  {t("general.contact")}
                </Text>
                <Columns columns={2} className="!gap-2">
                  {classroom.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      className={cn(`!border-0 hover:m-[-1px] hover:!border-1
                        focus:m-[-1px] focus:!border-1`)}
                    />
                  ))}
                </Columns>
              </section>
            )}
          </LookupDetailsContent>
        </>
      )}
    </LookupDetailsCard>
  );
};

export default ClassDetailsCard;
