import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import { LangCode, StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";

/**
 * The header for the Student List Printout for Students enrolled in an Elective
 * Subject. Compliant with the `header` prop of the Student List Printout
 * component.
 *
 * @param electiveSubject The Elective Subject to display the Student List for.
 * @param locale The locale code to display the header in.
 */
const EnrollmentPrintoutHeader: StylableFC<{
  electiveSubject: ElectiveSubject;
  locale: LangCode;
}> = ({ electiveSubject, locale, style, className }) => {
  const name = getLocaleString(electiveSubject.name, locale);
  const year = getLocaleYear(locale, getCurrentAcademicYear());

  return (
    <div style={style} className={className}>
      {/* Header */}
      <div className="text-center text-[0.925rem] leading-6">
        <p>
          {locale === "en-US"
            ? "Suankularb Wittayalai School"
            : "โรงเรียนสวนกุหลาบวิทยาลัย"}
        </p>
        <p>
          {locale === "en-US"
            ? `${name} | Academic Year ${year}`
            : `${name} | ปีการศึกษา ${year}`}
        </p>
      </div>

      {/* Class number and Advisors */}
      <div className="flex flex-row pl-16">
        <span className="mr-4 whitespace-nowrap font-bold">
          {locale === "en-US" ? "Teachers" : "ครูผู้สอน"}
        </span>
        <div className="mb-1 flex grow flex-row flex-wrap gap-x-2 font-bold">
          {electiveSubject.teachers
            .concat(electiveSubject.co_teachers)
            .map((teacher) => (
              <span key={teacher.id} className="-mb-1">
                {getLocaleName(locale, teacher, { prefix: true })}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPrintoutHeader;
