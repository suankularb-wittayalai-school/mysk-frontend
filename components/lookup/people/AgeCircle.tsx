import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import {
  differenceInDays,
  differenceInYears,
  getDaysInYear,
  isToday,
} from "date-fns";

/**
 * A circle that displays the age of a person, and a graphical representation of
 * how close they are to their next birthday.
 *
 * @param birthday The Date object of birth of the person.
 */
const AgeCircle: StylableFC<{
  birthday: Date;
}> = ({ birthday, style, className }) => {
  const ageInYears = differenceInYears(new Date(), birthday);

  const nextBirthday = new Date(birthday).setFullYear(
    birthday.getFullYear() + ageInYears + 1,
  );
  const daysToNextBirthday = differenceInDays(nextBirthday, new Date());

  return (
    <div
      style={style}
      className={cn(
        `relative aspect-square h-10 overflow-hidden rounded-full
        bg-surface-variant`,
        className,
      )}
    >
      <div
        style={{
          top: !isToday(birthday)
            ? `${(daysToNextBirthday / getDaysInYear(birthday)) * 100}%`
            : 0,
        }}
        className="absolute -mt-[4px]"
      >
        <svg
          width={40}
          height={44}
          viewBox="0 0 40 44"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 2L4 3.33333C3 4.66667 1 4.66667 0 3.33333V44H40V3.33333C39
              4.66667 37 4.66667 36 3.33333L35 2C33.5 0 30.5 0 29 2C27.5 4 24.5
              4 23 2C21.5 0 18.5 0 17 2C15.5 4 12.5 4 11 2C9.5 0 6.5 0 5 2Z"
            className="fill-inverse-primary"
          />
        </svg>
      </div>

      <Text type="title-medium" className="position-center">
        {ageInYears}
      </Text>
    </div>
  );
};

export default AgeCircle;
