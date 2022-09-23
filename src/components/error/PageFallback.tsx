// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  CardSupportingText,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";
import ErrorHeader from "./ErrorHeader";

const PageFallback = ({ error }: { error: Error }): JSX.Element => {
  const { t } = useTranslation("common");
  const router = useRouter();

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
      <ErrorHeader code={t("fallback.title")} />
      <Section>
        <Card type="stacked" appearance="outlined">
          <CardHeader
            icon={<MaterialIcon icon="folder_open" />}
            title={<h2>{t("fallback.stack")}</h2>}
          />
          <CardSupportingText>
            <code className="font-mono">
              <pre>{error.stack}</pre>
            </code>
          </CardSupportingText>
        </Card>
      </Section>
    </RegularLayout>
  );
};

export default PageFallback;
