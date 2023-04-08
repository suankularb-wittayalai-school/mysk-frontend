// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card } from "@suankularb-components/react";

const EmptyDetail: FC = () => {
  // Translation
  const { t } = useTranslation("common");

  return (
    <main className="hidden sm:block">
      <Card
        appearance="outlined"
        className="relative !grid h-full place-content-center"
      >
        <p className="text-on-surface-variant">Nothing selected.</p>
      </Card>
    </main>
  );
};

export default EmptyDetail;
