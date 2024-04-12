import PageHeader from "@/components/common/PageHeader";
import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import LandingBlobs from "@/components/landing/LandingBlobs";
import cn from "@/utils/helpers/cn";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  Actions,
  Button,
  ContentLayout,
  List,
  MaterialIcon,
} from "@suankularb-components/react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";

/**
 * A place where Students can choose and trade their Elective Subjects.
 *
 * @param electiveSubjects The Elective Subjects (compact) available for choosing.
 */
const StudentElectivePage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
}> = ({ electiveSubjects }) => {
  const { t: tx } = useTranslation("common");

  const [radioSelected, setRadioSelected] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Electives" })}</title>
      </Head>

      {/* Background */}
      <div
        className={cn(`fixed inset-0 -z-10 overflow-hidden sm:bottom-auto
          sm:h-screen`)}
      >
        <LandingBlobs className="inset-0" />
      </div>

      {/* Content */}
      <PageHeader parentURL="/learn">Choose elective</PageHeader>
      <ContentLayout
        className={cn(`grow *:!grid *:h-full *:grid-cols-[5fr,7fr]
          *:!gap-6`)}
      >
        <section className="!flex flex-col gap-3">
          {/* List */}
          <div className="h-0 grow overflow-auto rounded-xl bg-surface-bright">
            <List className="!py-2">
              {electiveSubjects.map((electiveSubject) => (
                <ElectiveListItem
                  key={electiveSubject.id}
                  electiveSubject={electiveSubject}
                  selected={radioSelected === electiveSubject.id}
                  onRadioToggle={(value) => {
                    if (value) setRadioSelected(electiveSubject.id);
                  }}
                  onClick={() => {}}
                />
              ))}
            </List>
          </div>

          {/* Choose Button */}
          <Actions>
            <Button appearance="filled" icon={<MaterialIcon icon="done" />}>
              Choose elective
            </Button>
          </Actions>
        </section>

        <div className="flex flex-col gap-6 *:rounded-xl *:bg-surface-bright">
          {/* Details */}
          <ElectiveDetailsCard className="grow" />

          {/* Trade */}
          <section className="h-72" />
        </div>

        <style jsx global>{`
          body {
            background-color: var(--surface-container);
          }

          .skc-root-layout {
            display: flex;
            flex-direction: column;
            height: 100dvh;
          }

          @media only screen and (min-width: 600px) {
            .skc-nav-bar::before {
              background-color: transparent !important;
            }

            .skc-page-header__blobs {
              display: none !important;
            }
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const electiveSubjects = [
    {
      id: "22e1b917-525f-4533-99db-322203c9e1b8",
      name: { th: "การสร้างเว็บเพจ 1", "en-US": "Webpage 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "7bf72240-fe5c-45b8-a8a9-6be8c5b31c1e",
      name: { th: "คอมพิวเตอร์กราฟิก 1 ", "en-US": "Computer graphics 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "93fe0147-3303-4dad-b758-6db69077ba6e",
      name: { th: "ศิลป์สร้างสรรค์ 1", "en-US": "Art 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "77139c3f-f81b-43df-bfae-9eb61bbd5295",
      name: { th: "ปฏิบัติการดนตรีไทย 1", "en-US": "Thai Music 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "ec52ecc2-5379-4681-8838-e3b14e3b8f37",
      name: { th: "ศิลปะการแสดง 1", "en-US": "Performing Arts 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "1bb63410-c863-4588-a2bf-f3262916ad67",
      name: { th: "ธุรกิจเบเกอรี่ 1", "en-US": "Bakery Business 1" },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "7c5a76f5-26c3-420c-a2f9-552f3c349128",
      name: {
        th: "ภาษาจีนเพื่อการท่องเที่ยว 1",
        "en-US": "Chinese for Tourism 1",
      },
      code: { th: "ว20281", "en-US": "SC20281" },
      teachers: [
        {
          first_name: { th: "วิยดา", "en-US": "Wiyada" },
          last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        },
      ],
      class_size: 25,
      cap_size: 25,
    },
  ];
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "elective",
        "lookup",
      ])),
      electiveSubjects,
    },
  };
};

export default StudentElectivePage;
