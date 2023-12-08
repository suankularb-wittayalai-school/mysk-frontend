// Imports
import AttendanceViewSelector from "@/components/attendance/AttendanceViewSelector";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Columns, ContentLayout } from "@suankularb-components/react";
import { omit } from "radash";
import { ComponentProps, ReactNode } from "react";

/**
 * The shared layout of the Attendance pages.
 *
 * @param children The content of the page.
 *
 * @see See {@link AttendanceViewSelector Attendance View Selector} for the rest of the props.
 */
const ClassAttendanceLayout: StylableFC<
  { children: ReactNode } & ComponentProps<typeof AttendanceViewSelector>
> = (props) => {
  const { children, style, className } = props;

  return (
    <ContentLayout>
      <Columns
        columns={12}
        style={style}
        className={cn(`mx-4 sm:mx-0`, className)}
      >
        <div
          className={cn(`col-span-4 space-y-6 sm:col-span-8 md:col-span-10
            md:col-start-2`)}
        >
          <AttendanceViewSelector {...omit(props, ["style", "className"])} />
          {children}
        </div>
      </Columns>
    </ContentLayout>
  );
};

export default ClassAttendanceLayout;
