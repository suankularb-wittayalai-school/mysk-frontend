// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardHeader,
  CardSupportingText,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ErrorHeader from "@components/error/ErrorHeader";

const PageFallback = ({ error }: { error: Error }): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("fallback.title") }}
          pageIcon={<MaterialIcon icon="sentiment_very_dissatisfied" />}
          backGoesTo={() => history.back()}
        />
      }
    >
      <ErrorHeader verbose={t("fallback.title")} />
      <Section>
        <div>
          <Card type="stacked" appearance="outlined">
            <CardHeader
              icon={<MaterialIcon icon="folder_open" />}
              title={<h2>{t("fallback.stack")}</h2>}
            />
            <CardSupportingText className="scroll-desktop overflow-x-auto">
              <code className="font-mono">
                <pre>{error.stack}</pre>
              </code>
            </CardSupportingText>
          </Card>
        </div>
      </Section>
    </RegularLayout>
  );
};

export default PageFallback;
