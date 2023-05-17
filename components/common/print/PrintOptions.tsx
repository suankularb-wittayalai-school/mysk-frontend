import { Button, MaterialIcon, Actions } from "@suankularb-components/react";
import Link from "next/link";
import { FC, ReactNode } from "react";

const PrintOptions: FC<{ children: ReactNode }> = ({ children }) => (
  <aside
    className="sticky top-12 divide-y-1 divide-outline rounded-xl bg-surface
      shadow-3 print:hidden lg:top-8 lg:shadow-none"
  >
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
    {children}
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
