// External libraries
import { FC, ReactNode } from "react";

// SK Components
import { Columns } from "@suankularb-components/react";

const ErrorHero: FC<{
  children?: ReactNode;
  image?: JSX.Element;
  title: string;
  code?: number;
  verbose?: string;
}> = ({ children, image, title, code, verbose }) => {
  return (
    <Columns columns={2}>
      {image}
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="skc-headline-large">{title}</h1>
          {(code || verbose) && (
            <p className="skc-title-large text-on-surface-variant">
              {[code, verbose].join(": ")}
            </p>
          )}
        </header>
        {children}
      </div>
    </Columns>
  );
};

export default ErrorHero;
