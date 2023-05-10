// External libraries
import { FC, ReactNode } from "react";

const DetailSection: FC<{
  children: ReactNode;
  title: string;
  className?: string;
}> = ({ children, title, className }) => {
  return (
    <div {...{ className }}>
      <h4 className="skc-title-medium">{title}</h4>
      {children}
    </div>
  );
};

export default DetailSection;
