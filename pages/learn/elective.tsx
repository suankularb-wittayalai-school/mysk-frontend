import PageHeader from "@/components/common/PageHeader";
import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import TradesCard from "@/components/elective/TradesCard";
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
const LearnElectivesPage: CustomPage<{
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
        className={cn(`fixed inset-0 bottom-auto -z-10 hidden h-screen overflow-hidden
          sm:block`)}
      >
        <LandingBlobs className="inset-0" />
      </div>

      {/* Content */}
      <PageHeader parentURL="/learn">Choose elective</PageHeader>
      <ContentLayout
        className={cn(`grow *:h-full *:!gap-6 sm:*:!grid
          md:*:grid-cols-[5fr,7fr]`)}
      >
        <section className="flex-col gap-3 space-y-3 sm:flex">
          {/* List */}
          <div
            className={cn(`grow sm:overflow-auto sm:rounded-xl
              sm:bg-surface-bright md:h-0`)}
          >
            <List className="sm:!py-2">
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
          <Actions
            className={cn(`pointer-events-none sticky inset-0 bottom-20 top-auto
              z-10 !-mt-6 !block bg-gradient-to-t from-surface-container p-4
              pt-12 sm:static sm:!mt-0 sm:!flex sm:bg-none sm:p-0 sm:px-0`)}
          >
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="done" />}
              className="!pointer-events-auto"
            >
              Choose elective
            </Button>
          </Actions>
        </section>

        <div
          className={cn(`flex flex-col gap-6 *:rounded-xl *:bg-surface-bright
            md:pb-[3.25rem]`)}
        >
          {/* Details */}
          <ElectiveDetailsCard className="hidden grow md:flex" />

          {/* Trade */}
          <TradesCard
            className={cn(`mb-16 h-36 !rounded-b-none sm:m-0
              sm:!rounded-b-xl`)}
          />
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
      name: { th: "คอมพิวเตอร์กราฟิก 1 ", "en-US": "Computer Graphics 1" },
      code: { th: "ว20283", "en-US": "SC20283" },
      teachers: [
        {
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "93fe0147-3303-4dad-b758-6db69077ba6e",
      name: { th: "ศิลป์สร้างสรรค์ 1", "en-US": "Art 1" },
      code: { th: "ศ20201", "en-US": "ART20201" },
      teachers: [
        {
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "77139c3f-f81b-43df-bfae-9eb61bbd5295",
      name: { th: "ปฏิบัติการดนตรีไทย 1", "en-US": "Thai Music 1" },
      code: { th: "ศ20207", "en-US": "ART20207" },
      teachers: [
        {
          first_name: { th: "ปานจันทร์", "en-US": "Panjan" },
          last_name: { th: "ปล้องทอง", "en-US": "Plongthong" },
        },
        {
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "ec52ecc2-5379-4681-8838-e3b14e3b8f37",
      name: { th: "ศิลปะการแสดง 1", "en-US": "Performing Arts 1" },
      code: { th: "ศ20211", "en-US": "ART20211" },
      teachers: [
        },
      ],
      class_size: 17,
      cap_size: 25,
    },
    {
      id: "1bb63410-c863-4588-a2bf-f3262916ad67",
      name: { th: "ธุรกิจเบเกอรี่ 1", "en-US": "Bakery Business 1" },
      code: { th: "ง20227", "en-US": "WT20227" },
      teachers: [
        {
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
      code: { th: "จ20201", "en-US": "CHI20201" },
      teachers: [
        {
          first_name: { th: "ณภกรณ์", "en-US": "Naphakorn" },
          last_name: { th: "พรหมมาส", "en-US": "Prommas" },
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

export default LearnElectivesPage;
