import TextGlance from "@/components/home/glance/TextGlance";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { MaterialIcon } from "@suankularb-components/react";
import { differenceInYears } from "date-fns";
import { Trans, useTranslation } from "next-i18next";

/**
 * A Glance that celebrates a Student’s birthday.
 *
 * @param person The Student to celebrate.
 */
const BirthdayGlance: StylableFC<{
  person?: Pick<Student, "first_name" | "nickname" | "birthdate">;
}> = ({ person, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  /**
   * The age of the Student.
   */
  const age = person?.birthdate
    ? differenceInYears(new Date(), new Date(person.birthdate))
    : null;

  return (
    <TextGlance
      icon={<MaterialIcon icon="cake" size={20} />}
      visible={person !== undefined}
      style={style}
      className={className}
    >
      <Trans
        i18nKey="glance.birthday"
        ns="home"
        values={{
          name: person!.nickname?.th
            ? getLocaleString(person!.nickname, locale)
            : getLocaleName(locale, person!, {
                middleName: false,
                lastName: false,
              }),
          year: tx("ordinal", { count: age, ordinal: true }),
        }}
        components={{ b: <strong /> }}
      />
    </TextGlance>
  );
};

export default BirthdayGlance;
