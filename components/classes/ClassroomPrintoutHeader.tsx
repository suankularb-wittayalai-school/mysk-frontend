import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import { Classroom } from "@/utils/types/classroom";
import { LangCode, StylableFC } from "@/utils/types/common";

/**
 * The header for the Student List Printout of a Classroom. Compliant with the
 * `header` prop of the Student List Printout component.
 *
 * @param classroom The Classroom to display the Student List for.
 * @param locale The locale code to display the header in.
 */
const ClassroomPrintoutHeader: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "class_advisors">;
  locale: LangCode;
}> = ({ classroom, locale, style, className }) => {
  const grade = Math.floor(classroom.number / 100);
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
            ? `Mattayomsuksa ${grade} Student List for Academic Year ${year}`
            : `รายชื่อนักเรียนชั้นมัธยมศึกษาปีที่ ${grade} ปีการศึกษา ${year}`}
        </p>
      </div>

      {/* Class number and Advisors */}
      <div className="flex flex-row">
        <span
          className={cn(`-mt-2 ml-4 mr-14 inline-block self-end
            whitespace-nowrap text-xl font-medium`)}
        >
          {locale === "en-US"
            ? `M.${classroom.number}`
            : `ม.${classroom.number}`}
        </span>
        <span className="mr-4 whitespace-nowrap font-bold">
          {locale === "en-US" ? "Class advisors" : "ครูที่ปรึกษา"}
        </span>
        <div className="mb-1 flex grow flex-row flex-wrap gap-x-2 font-bold">
          {classroom.class_advisors.map((teacher) => (
            <span key={teacher.id} className="-mb-1">
              {getLocaleName(locale, teacher, { prefix: true })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassroomPrintoutHeader;
