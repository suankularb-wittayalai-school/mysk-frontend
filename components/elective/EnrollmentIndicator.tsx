import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";

/**
 * An indicator showing the enrollment status of an Elective Subject.
 *
 * @param classSize The number of students enrolled in the Elective Subject.
 * @param capSize The maximum number of students that can be enrolled in the Elective Subject.
 */
const EnrollmentIndicator: StylableFC<{
  classSize: number;
  capSize: number;
}> = ({ classSize, capSize, style, className }) => {
  const isFull = classSize >= capSize;

  return (
    <div className={cn(`space-y-1`, className)} style={style}>
      <Text
        type="body-small"
        className="block text-center text-on-surface-variant"
      >
        <Text
          type="body-medium"
          className={cn(`!font-medium`, isFull ? `text-error` : `text-primary`)}
        >
          {classSize}
        </Text>
        /{capSize}
      </Text>

      <Progress
        appearance="linear"
        alt="Enrollment"
        value={(classSize / capSize) * 100}
        visible
        className={cn(
          `w-10 *:!gap-0 *:!-space-x-0.5 [&>*>*:first-child]:z-10
          [&>*>*:last-child]:hidden`,
          isFull && `![--_indicator-color:var(--error)]`,
        )}
      />
    </div>
  );
};

export default EnrollmentIndicator;
