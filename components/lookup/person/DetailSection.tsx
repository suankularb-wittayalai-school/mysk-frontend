// External libraries
import { FC, ReactNode } from "react";

const DetailSection: FC<{
  children: ReactNode;
  id: string;
  title: string;
  className?: string;
}> = ({ children, id, title, className }) => {
  return (
    <section aria-labelledby={`header-${id}`} {...{ className }}>
      <h4 id={`header-${id}`} className="skc-title-medium">
        {title}
      </h4>
      {children}
    </section>
  );
};

export default DetailSection;
