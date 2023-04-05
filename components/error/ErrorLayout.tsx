// External libraries
import { FC, ReactNode } from "react";

// SK Components
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";

const ErrorLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex min-h-screen flex-col justify-center bg-gradient-to-b
        from-surface-variant via-transparent bg-fixed
        px-4 supports-[height:100dvh]:min-h-[100dvh] sm:px-0"
    >
      <div className="absolute top-14 left-4 right-4">
        <div className="mx-auto w-full max-w-[70.5rem] sm:w-[calc(100%-10rem)]">
          <Button
            appearance="text"
            icon={<MaterialIcon icon="arrow_backward" />}
            alt="Go back"
            onClick={() => window.history.back()}
            className="-left-2 before:!bg-on-surface [&_i]:text-on-surface [&_span]:!bg-on-surface"
          />
        </div>
      </div>
      <ContentLayout>
        <Columns columns={6}>
          <div className="col-span-2 sm:col-span-4 md:col-span-4 md:col-start-2">
            {children}
          </div>
        </Columns>
      </ContentLayout>
    </div>
  );
};

export default ErrorLayout;
