// Imports
import { Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { usePlausible } from "next-plausible";
import { FC } from "react";

/**
 * Links to SK IT Solutions and SK Kornor.
 *
 * @returns A `<section>`.
 */
const UsefulLinksSection: FC = () => {
  const { t } = useTranslation("club");

  const plausible = usePlausible();

  return (
    <section
      aria-labelledby="header-useful-links"
      className="flex flex-col gap-3"
    >
      <Text type="headline-large" element="h2">
        {t("usefulLinks.title")}
      </Text>
      <ul className="list-disc pl-6">
        {/* Email SKIso */}
        <li>
          <Trans
            i18nKey="club:usefulLinks.skiso"
            ns="index"
            components={{
              a: (
                <a
                  className="link"
                  href="mailto:itsolutions@sk.ac.th"
                  onClick={() =>
                    plausible("Create Email Draft to Support", {
                      props: { location: "Useful Links Section" },
                    })
                  }
                />
              ),
            }}
          />
        </li>

        {/* Message Kornor */}
        <li>
          <Trans
            i18nKey="club:usefulLinks.kornor"
            ns="index"
            components={{
              a: (
                <a
                  className="link"
                  href="https://www.instagram.com/skkornor.official/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => plausible("Open Kornor’s Page")}
                />
              ),
            }}
          />
        </li>
      </ul>
    </section>
  );
};

export default UsefulLinksSection;
