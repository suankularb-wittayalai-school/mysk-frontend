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
        from-surface-5 via-transparent bg-fixed px-4
        supports-[height:100dvh]:min-h-[calc(100dvh-5rem)] sm:px-0
        supports-[height:100dvh]:sm:min-h-[100dvh]"
    >
      <div className="fixed top-4 left-4 right-4 sm:top-11">
        <div
          className="mx-auto w-full max-w-[72.5rem]
            sm:w-[calc(100%-11rem)]"
        >
          <Button
            appearance="text"
            icon={<MaterialIcon icon="arrow_backward" />}
            alt="Go back"
            onClick={() => window.history.back()}
            className="-left-2 before:!bg-on-surface [&_i]:text-on-surface
              [&_span]:!bg-on-surface"
          />
        </div>
      </div>
      <ContentLayout>
        <Columns columns={6}>
          <div
            className="col-span-2 flex flex-col gap-6 sm:col-span-4
              md:col-span-4 md:col-start-2"
          >
            {children}
          </div>
        </Columns>
      </ContentLayout>
    </div>
  );
};

export default ErrorLayout;
