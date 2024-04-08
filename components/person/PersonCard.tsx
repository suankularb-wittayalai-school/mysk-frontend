import PersonAvatar from "@/components/common/PersonAvatar";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Person, Student, Teacher, UserRole } from "@/utils/types/person";
import { Card, CardHeader } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { ComponentProps, FC, useState } from "react";

/**
 * A Card that displays a Person’s details.
 *
 * @param person The Person to display.
 * @param options Options for the Card.
 */
const PersonCard: FC<
  Partial<Omit<ComponentProps<typeof Card>, "children">> & {
    person: // Fetching and Avatar
    Pick<Student | Teacher, "id" | "role" | "profile"> &
      // Name fields
      Partial<
        Pick<Person, "first_name" | "middle_name" | "last_name" | "nickname">
      > &
      // Role-specific fields
      (Pick<Student, "classroom"> | Pick<Teacher, "subject_group">);
    options?: Partial<{
      hideClassroomInSubtitle: boolean;
      showNicknameinSubtitle: boolean;
    }> &
      ComponentProps<typeof WithPersonDetails>["options"];
  }
> = ({ person, options, ...props }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <WithPersonDetails
      open={detailsOpen}
      person={person}
      onClose={() => setDetailsOpen(false)}
      options={options}
    >
      <Card
        appearance="outlined"
        stateLayerEffect
        onClick={() => setDetailsOpen(true)}
        {...props}
      >
        <CardHeader
          avatar={<PersonAvatar {...person} />}
          title={getLocaleName(locale, person)}
          subtitle={sift([
            person.role === UserRole.student
              ? sift([
                  !options?.hideClassroomInSubtitle &&
                    (person as Student).classroom &&
                    t("class", (person as Student).classroom),
                  t("classNo", { classNo: (person as Student).class_no }),
                ]).join(" • ")
              : (person as Teacher).subject_group &&
                getLocaleString((person as Teacher).subject_group.name, locale),
            options?.showNicknameinSubtitle &&
              person.nickname?.th &&
              getLocaleString(person.nickname, locale),
          ]).join(" • ")}
        />
      </Card>
    </WithPersonDetails>
  );
};

export default PersonCard;