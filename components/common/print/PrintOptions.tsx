// External libraries
import Link from "next/link";
import { FC, ReactNode } from "react";

// SK Components
import { Button, MaterialIcon, Actions } from "@suankularb-components/react";

const PrintOptions: FC<{ children: ReactNode }> = ({ children }) => (
  <aside className="fixed bottom-20 z-50 w-screen divide-y-1 divide-outline rounded-t-xl shadow-3 md:shadow-none bg-surface-3 print:hidden sm:inset-0 sm:left-auto sm:h-auto sm:w-96 sm:rounded-l-xl sm:rounded-tr-none lg:sticky md:top-0 lg:w-full lg:rounded-r-xl sm:bg-surface lg:top-8">
    <header className="flex flex-row items-center gap-2 py-2 pl-2 pr-4">
      <Button
        appearance="text"
        icon={<MaterialIcon icon="arrow_backward" />}
        alt="Navigate up"
        href="/class/student"
        element={Link}
        className="!text-on-surface state-layer:!bg-on-surface"
      />
      <h2 className="skc-title-large">Print options</h2>
    </header>
    <div className="h-56 overflow-x-auto sm:h-auto">{children}</div>
    <Actions className="px-4 py-3.5">
      <Button
        appearance="filled"
        icon={<MaterialIcon icon="print" />}
        onClick={() => window.print()}
      >
        Print
      </Button>
    </Actions>
  </aside>
);

export default PrintOptions;
