import CertificateTypeIcon from "@/components/account/certificates/CertificateTypeIcon";
import cn from "@/utils/helpers/cn";
import { StudentCertificate } from "@/utils/types/certificate";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader, Columns, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { camel } from "radash";

/**
 * A grid that displays a Student’s Student Certificates.
 *
 * @param certificates The Student Certificates to display.
 */
const StudentCertificateGrid: StylableFC<{
  certificates: StudentCertificate[];
}> = ({ certificates, style, className }) => {
  const { t } = useTranslation("search/students/detail");

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text
        type="title-medium"
        element="h3"
        className="rounded-md bg-surface px-3 py-2"
      >
        {t("certificates.title")}
      </Text>
      <Columns columns={2} className="!gap-2">
        {certificates.map((certificate) => (
          <Card
            key={certificate.id}
            appearance="outlined"
            className="!border-transparent"
          >
            <CardHeader
              icon={<CertificateTypeIcon type={certificate.certificate_type} />}
              title={t(
                `common:certificate.${camel(certificate.certificate_type)}`,
              )}
              subtitle={certificate.certificate_detail}
            />
          </Card>
        ))}
      </Columns>
    </section>
  );
};

export default StudentCertificateGrid;
