// Modules
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { LinkButton, RegularLayout, Title } from "@suankularb-components/react";

const DevelopersBanner = (): JSX.Element => (
  <section className="container-secondary layout-grid-cols-2 rounded-2xl">
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
        <ul className="layout-grid-cols-2 !gap-y-0 font-sans">
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
        <ul className="layout-grid-cols-2 font-sans">
          <li>Supannee Supeerat</li>
          <li>Atipol Sukrisadanon</li>
        </ul>
      </section>
    </div>

    {/* Image */}
    <div></div>
  </section>
);

// Page
const Developers: NextPage = (): JSX.Element => (
  <RegularLayout
    Title={
      <Title
        name={{ title: "About Developers" }}
        pageIcon="information"
        backGoesTo="/account/login"
        LinkElement={Link}
        key="title"
      />
    }
  >
    <DevelopersBanner />
    <p>TODO</p>
  </RegularLayout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "about"])),
  },
});

export default Developers;
