// Modules
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

const StudentSection = (): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" allowCustomSize />}
            text="Student list"
          />
        </div>
        <Search placeholder="Search student" className="[grid-area:search]" />
      </div>
      <Table>
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <div className="flex flex-row items-center justify-end gap-2">
        <Button type="outlined" />
        <LinkButton type="filled" url="/t/admin/students" LinkElement={Link} />
      </div>
    </Section>
  );
};

const Admin: NextPage = () => {
  const { t } = useTranslation("admin");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: "Admin" }}
          pageIcon={<MaterialIcon icon="security" />}
          backGoesTo="/t/home"
          LinkElement={Link}
        />
      }
    >
      <StudentSection />
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "admin"])),
    },
  };
};

export default Admin;
