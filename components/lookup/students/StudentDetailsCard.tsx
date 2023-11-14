// Imports
import MultilangText from "@/components/common/MultilingualText";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import StudentHeader from "@/components/lookup/students/StudentHeader";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/component";
import { Student } from "@/utils/types/person";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import LookupDetailsContent from "../LookupDetailsContent";
import InformationCard from "../people/InformationCard";
import PersonContactGrid from "../people/PersonContactGrid";

/**
 * A Card that contains the details of a Student in Search Students.
 *
 * @param student The Student to show the details of.
 */
const StudentDetailsCard: StylableFC<{
  student?: Student;
}> = ({ student, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  return (
    <LookupDetailsCard style={style} className={className}>
      <AnimatePresence>
        {student && (
          <>
            <StudentHeader student={student} />
            <LookupDetailsContent>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <InformationCard title="Full name" className="col-span-2">
                  <MultilangText
                    text={{
                      th: getLocaleName("th", student, { prefix: true }),
                      "en-US": getLocaleName("en-US", student, {
                        prefix: true,
                      }),
                    }}
                    options={{
                      combineIfAllIdentical: true,
                      hideIconsIfOnlyLanguage: true,
                    }}
                  />
                </InformationCard>
                {student.nickname &&
                  sift(Object.values(student.nickname)).length > 0 && (
                    <InformationCard title="Nickname">
                      <MultilangText
                        text={student.nickname}
                        options={{
                          combineIfAllIdentical: true,
                          hideIconsIfOnlyLanguage: true,
                        }}
                      />
                    </InformationCard>
                  )}
                {student.classroom && (
                  <InformationCard title="Classroom">
                    {[
                      tx("class", { number: student.classroom.number }),
                      `No. ${student.class_no}`,
                    ].join(" • ")}
                  </InformationCard>
                )}
                {student.birthdate &&
                  // Assuming no real person is born on Jan 1, 1970
                  student.birthdate !== "1970-01-01" && (
                    <InformationCard title="Birthday">
                      <time>
                        {new Date(student.birthdate).toLocaleDateString(
                          locale,
                          { day: "numeric", month: "long", year: undefined },
                        )}
                      </time>
                    </InformationCard>
                  )}
              </div>

              {student.contacts.length > 0 && (
                <PersonContactGrid contacts={student.contacts} />
              )}
            </LookupDetailsContent>
          </>
        )}
      </AnimatePresence>
    </LookupDetailsCard>
  );
};

export default StudentDetailsCard;
