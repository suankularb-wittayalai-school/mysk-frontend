// Modules
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// SK Components
import { Header, MaterialIcon, Section } from "@suankularb-components/react";

// Utils
import { FormField } from "@utils/types/news";

const ArticleForm = ({
  mode,
  setFields: setExtFields,
}: {
  mode: "add" | "edit";
  setFields: (incFields: Omit<FormField, "id">[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  // Form control
  const [fields, setFields] = useState<Omit<FormField, "id">[]>([]);
  useEffect(() => setExtFields(fields), [fields]);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="table" allowCustomSize />}
        text="Form"
      />
    </Section>
  );
};

export default ArticleForm;
