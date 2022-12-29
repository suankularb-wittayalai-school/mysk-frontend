// External libraries
import { FC } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

const Includes: FC<{
  includes: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  className?: string;
}> = ({ includes, className }) => (
  <div className={["ml-2 flex flex-row", className].join(" ")}>
    {includes.teachers && (
      <MaterialIcon
        icon="school"
        className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2
          text-secondary"
      />
    )}
    {includes.parents && (
      <MaterialIcon
        icon="escalator_warning"
        className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2
          text-primary"
      />
    )}
    {includes.students && (
      <MaterialIcon
        icon="groups"
        className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2
          text-primary"
      />
    )}
  </div>
);

export default Includes;
