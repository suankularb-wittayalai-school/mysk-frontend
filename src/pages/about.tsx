// Modules
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Chip,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Types
import { Contact, ContactVia } from "@utils/types/contact";
import ProfilePicture from "@components/ProfilePicture";
import { useRouter } from "next/router";

const DevelopersBanner = (): JSX.Element => (
  <Section>
    <div>
      <div className="container-secondary layout-grid-cols-2 rounded-2xl">
        {/* Text */}
        <div className="m-4 flex flex-col gap-4">
          {/* Title */}
          <section className="flex flex-col gap-2 font-display leading-none">
            <p className="text-lg">The 2022 version of MySK is maintained by</p>
            <p className="text-4xl font-medium">
              Suankularb{" "}
              <span
                className="bg-gradient-to-br from-primary to-tertiary font-extrabold text-tertiary
                  [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              >
                Tech
              </span>
              nology and{" "}
              <span
                className="bg-gradient-to-br from-tertiary to-primary font-extrabold text-tertiary
                  [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              >
                Dev
              </span>
              elopment Club
            </p>
          </section>
          {/* Development led by */}
          <section>
            <h3 className="font-display text-xl font-medium leading-snug">
              Development led by
            </h3>
            <ul className="flex flex-col gap-x-6 font-sans md:grid md:grid-cols-2">
              <li>Tempoom Leelacharoen</li>
              <li>Sadudee Theparree</li>
              <li>Smart Wattanapornmongkol</li>
              <li>Siravit Phokeed</li>
            </ul>
          </section>
          {/* With advice from */}
          <section>
            <h3 className="font-display text-xl font-medium leading-snug">
              With advice from
            </h3>
            <ul className="flex flex-col gap-x-6 font-sans md:grid md:grid-cols-2">
              <li>Supannee Supeerat</li>
              <li>Atipol Sukrisadanon</li>
            </ul>
          </section>
        </div>
        {/* Image */}
        <div></div>
      </div>
    </div>
  </Section>
);

const ContactDevelopers = (): JSX.Element => (
  <Section>
    <Header
      icon={<MaterialIcon icon="badge" allowCustomSize />}
      text="Contact developers"
    />
    <p>
      Found issues with the website? Contact the developers in the field you are
      having trouble with below. Alternatively, if you know what you’re doing,
      consider{" "}
      <a
        className="link"
        href="https://github.com/suankularb-wittayalai-school"
        target="_blank"
        rel="noreferrer"
      >
        joining the Contributors team
      </a>
      !
    </p>
    <ContactList
      contacts={[
        {
          name: {
            th: "เต็มภูมิ ลีลาเจริญ",
            "en-US": "Tempoom Leelacharoen",
          },
          jobDescs: [
            {
              th: "วิศวกรประกันคุณภาพ",
              "en-US": "Quality assurance engineer",
            },
            {
              th: "ผู้พัฒนาฐานข้อมูล",
              "en-US": "Backend developer",
            },
          ],
          contacts: [],
        },
        {
          name: {
            th: "สดุดี เทพอารีย์",
            "en-US": "Sadudee Theparree",
          },
          jobDescs: [],
          contacts: [],
        },
      ]}
    />
  </Section>
);

const ContactAdvisors = (): JSX.Element => (
  <Section>
    <Header
      icon={<MaterialIcon icon="supervised_user_circle" allowCustomSize />}
      text="Contact advisors"
    />
    <p>
      For more sensitive questions and concerns, please contact our advisors
      instead.
    </p>
    <ContactList
      contacts={[
        {
          name: {
            th: "สุพรรณี สุพีรัตน์",
            "en-US": "Supannee Supeerat",
          },
          jobDescs: [
            {
              th: "ที่ปรึกษา",
              "en-US": "Advisor",
            },
          ],
          contacts: [],
        },
        {
          name: {
            th: "อติพล สุกฤษฎานนท์",
            "en-US": "Atipol Sukrisadanon",
          },
          jobDescs: [
            {
              th: "ที่ปรึกษา",
              "en-US": "Advisor",
            },
          ],
          contacts: [],
        },
      ]}
    />
  </Section>
);

const ContactList = ({
  contacts,
}: {
  contacts: {
    name: { th: string; "en-US"?: string };
    jobDescs: { th: string; "en-US"?: string }[];
    contacts: { type: ContactVia; value: string }[];
  }[];
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <ul className="layout-grid-cols-3 my-4">
      {contacts.map((contact) => (
        <li key={contact.name.th} className="grid grid-cols-4 gap-x-6">
          <div className="overflow-hidden rounded-xl">
            <ProfilePicture />
          </div>
          <div className="col-span-3">
            <h3 className="break-all font-display text-xl font-bold leading-snug">
              {contact.name[locale] || contact.name.th}
            </h3>
            <ul>
              {contact.jobDescs.map((jobDesc) => (
                <li key={jobDesc.th}>{jobDesc[locale] || jobDesc.th}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Page
const Developers: NextPage = (): JSX.Element => (
  <RegularLayout
    Title={
      <Title
        name={{ title: "About developers" }}
        pageIcon="information"
        backGoesTo="/account/login"
        LinkElement={Link}
        key="title"
      />
    }
  >
    <DevelopersBanner />
    <ContactDevelopers />
    <ContactAdvisors />
  </RegularLayout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "about"])),
  },
});

export default Developers;
