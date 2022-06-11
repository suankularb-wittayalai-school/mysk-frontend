// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";
import ProfilePicture from "@components/ProfilePicture";

// Types
import { MultiLangString } from "@utils/types/common";
import { ContactVia } from "@utils/types/contact";

type PeopleListType = {
  name: { th: string; "en-US"?: string };
  profile?: string;
  jobDescs: { th: string; "en-US"?: string }[];
  contacts: { type: ContactVia; url: string }[];
}[];

// Sections
const DevelopersBanner = ({
  coreTeam,
  advisors,
}: {
  coreTeam: MultiLangString[];
  advisors: MultiLangString[];
}): JSX.Element => {
  const { t } = useTranslation("about");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Section>
      <div>
        <div className="container-secondary flex flex-col gap-x-6 overflow-hidden rounded-2xl sm:grid-cols-2 md:grid">
          {/* Text */}
          <div className="m-4 flex flex-col gap-4">
            {/* Title */}
            <section className="flex flex-col gap-2 font-display leading-none">
              <p className="text-lg">{t("banner.leading")}</p>
              <p className="text-4xl font-medium">
                <Trans i18nKey="banner.title" ns="about">
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
                </Trans>
              </p>
            </section>

            {/* Development led by */}
            <section aria-labelledby="led-by">
              <h3
                id="led-by"
                className="font-display text-xl font-medium leading-snug"
              >
                {t("banner.ledBy")}
              </h3>
              <ul
                aria-labelledby="led-by"
                className="flex flex-col gap-x-6 font-sans sm:grid sm:grid-cols-2"
              >
                {coreTeam.map((developer) => (
                  <li key={developer.th}>{developer[locale]}</li>
                ))}
              </ul>
            </section>

            {/* With advice from */}
            <section aria-labelledby="advice-from">
              <h3
                id="advice-from"
                className="font-display text-xl font-medium leading-snug"
              >
                {t("banner.adviceFrom")}
              </h3>
              <ul
                aria-labelledby="advice-from"
                className="flex flex-col gap-x-6 font-sans sm:grid sm:grid-cols-2"
              >
                {advisors.map((advisor) => (
                  <li key={advisor.th}>{advisor[locale]}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Image */}
          <div
            className="flex flex-row items-end justify-center
            sm:justify-end sm:px-6 md:mt-8 md:justify-center"
          >
            <Image
              src="/images/core-team.png"
              height={256}
              width={433.5}
              alt={t("banner.groupPhotoAlt")}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

const ContactDevelopers = ({
  developerList,
}: {
  developerList: PeopleListType;
}): JSX.Element => {
  const { t } = useTranslation("about");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="badge" allowCustomSize />}
        text={t("contactDevs.title")}
      />
      <p>
        <Trans i18nKey="contactDevs.supportingText" ns="about">
          Found issues with the website? Contact the developers in the field you
          are having trouble with below. Alternatively, check out{" "}
          <a
            className="link"
            href="https://github.com/suankularb-wittayalai-school"
            target="_blank"
            rel="noreferrer"
          >
            our GitHub organization
          </a>
          .
        </Trans>
      </p>
      <PeopleList people={developerList} />
    </Section>
  );
};

const ContactAdvisors = ({
  advisorList,
}: {
  advisorList: PeopleListType;
}): JSX.Element => {
  const { t } = useTranslation("about");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="supervised_user_circle" allowCustomSize />}
        text={t("contactAdvisors.title")}
      />
      <p>{t("contactAdvisors.supportingText")}</p>
      <PeopleList people={advisorList} />
    </Section>
  );
};

const ContributeSection = () => {
  const { t } = useTranslation("about");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="waving_hand" allowCustomSize />}
        text={t("contribute.title")}
      />
      <p>
        <Trans i18nKey="contribute.supportingText" ns="about">
          MySK is an open source project, which means that anyone, including
          you, can contribute. If you plan to contribute to MySK, check us out
          on{" "}
          <a
            className="link"
            href="https://github.com/suankularb-wittayalai-school"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          ,{" "}
          <a
            className="link"
            href="https://discord.gg/nEPPqx7kK2"
            target="_blank"
            rel="noreferrer"
          >
            developer Discord
          </a>
          , and our{" "}
          <a
            className="link"
            href="https://www.facebook.com/SKTechDev"
            target="_blank"
            rel="noreferrer"
          >
            club Facebook page
          </a>
          .
        </Trans>
      </p>
      <p>
        {t("contribute.contributorsList")}
      </p>
      <ul className="layout-grid-cols-6">
        <li>
          <a
            className="link"
            href="https://www.facebook.com/SKTechDev"
            target="_blank"
            rel="noreferrer"
          >
            CCSleep
          </a>
        </li>
        <li>
          <a
            className="link"
            href="https://galax.tech"
            target="_blank"
            rel="noreferrer"
          >
            Galax
          </a>
        </li>
      </ul>
    </Section>
  );
};

// Components
const PeopleList = ({ people }: { people: PeopleListType }): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <ul className="layout-grid-cols-3 sm:my-4">
      {people.map((person) => (
        <li key={person.name.th} className="grid grid-cols-4 gap-x-6">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-xl">
              <ProfilePicture src={person.profile} />
            </div>
          </div>
          <div className="col-span-3">
            <h3 className="font-display text-xl font-bold leading-snug">
              {person.name[locale] || person.name.th}
            </h3>
            <ul>
              {person.jobDescs.map((jobDesc) => (
                <li key={jobDesc.th}>{jobDesc[locale] || jobDesc.th}</li>
              ))}
            </ul>
            <div className="my-2 flex w-fit flex-row gap-1 pr-1">
              {person.contacts.map((contact) => (
                <a
                  key={contact.url}
                  href={contact.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ContactIcon icon={contact.type} />
                </a>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Page
const Developers: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["about", "common"]);

  // People list
  const coreTeam: MultiLangString[] = [
    {
      th: "เต็มภูมิ ลีลาเจริญ",
      "en-US": "Tempoom Leela­charoen",
    },
    {
      th: "สดุดี เทพอารีย์",
      "en-US": "Sadudee Theparree",
    },
    {
      th: "สมัชญ์ วัฒนพรมงคล",
      "en-US": "Smart Wattana­porn­mongkol",
    },
    {
      th: "ศิรวิทย์ โพธิ์ขีด",
      "en-US": "Siravit Phokeed",
    },
  ];
  const advisorNames: MultiLangString[] = [
    {
      th: "อาจารย์สุพรรณี สุพีรัตน์",
      "en-US": "T. Supannee Supeerath",
    },
    {
      th: "อาจารย์อติพล สุกฤษฎานนท์",
      "en-US": "T. Atipol Sukrisadanon",
    },
  ];
  const developerList: PeopleListType = [
    {
      name: {
        th: "เต็มภูมิ ลีลาเจริญ",
        "en-US": "Tempoom Leela­charoen",
      },
      profile: "/images/developers/tempoom.png",
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
      contacts: [
        { type: "Email", url: "mailto:tempoom.lee@student.sk.ac.th" },
        {
          type: "GitHub",
          url: "https://github.com/orgs/suankularb-wittayalai-school/people/Temp9699",
        },
      ],
    },
    {
      name: {
        th: "สดุดี เทพอารีย์",
        "en-US": "Sadudee Theparree",
      },
      profile: "/images/developers/sadudee.png",
      jobDescs: [
        {
          th: "ผู้พัฒนาฐานเว็บไซต์",
          "en-US": "Frontend developer",
        },
      ],
      contacts: [
        { type: "Email", url: "mailto:sadudee.the@student.sk.ac.th" },
        {
          type: "GitHub",
          url: "https://github.com/orgs/suankularb-wittayalai-school/people/IHasDiabetes",
        },
        { type: "Website", url: "https://imsad.dev" },
      ],
    },
    {
      name: {
        th: "สมัชญ์ วัฒนพรมงคล",
        "en-US": "Smart Wattana­porn­mongkol",
      },
      profile: "/images/developers/smart.png",
      jobDescs: [
        {
          th: "นักออกแบบสถาปัตยกรรมฐานข้อมูล",
          "en-US": "Database architecture engineer",
        },
        {
          th: "ผู้พัฒนาฐานข้อมูล",
          "en-US": "Backend developer",
        },
      ],
      contacts: [
        { type: "Email", url: "mailto:smart.wat@student.sk.ac.th" },
        {
          type: "GitHub",
          url: "https://github.com/orgs/suankularb-wittayalai-school/people/Jimmy-Tempest",
        },
        { type: "Website", url: "https://smartwatt.me" },
      ],
    },
    {
      name: {
        th: "ศิรวิทย์ โพธิ์ขีด",
        "en-US": "Siravit Phokeed",
      },
      profile: "/images/developers/siravit.png",
      jobDescs: [
        {
          th: "นักออกแบบเว็บไซต์",
          "en-US": "UI/UX designer",
        },
        {
          th: "ผู้พัฒนาฐานเว็บไซต์",
          "en-US": "Frontend developer",
        },
      ],
      contacts: [
        { type: "Email", url: "mailto:siravit.pho@student.sk.ac.th" },
        {
          type: "GitHub",
          url: "https://github.com/orgs/suankularb-wittayalai-school/people/SiravitPhokeed",
        },
        { type: "Website", url: "https://siravit-p.vercel.app" },
      ],
    },
  ];
  const advisorList: PeopleListType = [
    {
      name: {
        th: "สุพรรณี สุพีรัตน์",
        "en-US": "Supannee Supeerath",
      },
      jobDescs: [
        {
          th: "ที่ปรึกษา",
          "en-US": "Advisor",
        },
      ],
      contacts: [{ type: "Email", url: "mailto:supannee@sk.ac.th" }],
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
      contacts: [
        { type: "Email", url: "mailto:atipol.suk@sk.ac.th" },
        { type: "Line", url: "https://line.me/ti/p/~zsakez" },
        { type: "Phone", url: "tel:+66614166498" },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>
          {t("title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon="information"
            backGoesTo="/account/login"
            LinkElement={Link}
          />
        }
      >
        <DevelopersBanner coreTeam={coreTeam} advisors={advisorNames} />
        <ContactDevelopers developerList={developerList} />
        <ContactAdvisors advisorList={advisorList} />
        <ContributeSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "about"])),
  },
});

export default Developers;
