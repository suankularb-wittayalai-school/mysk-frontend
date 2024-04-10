import PageHeader from "@/components/common/PageHeader";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const ElectivePage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
}> = ({ electiveSubjects }) => {
  return (
    <>
      <Head>
        <title>Elective</title>
      </Head>
      <PageHeader>MySK Elective</PageHeader>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const electiveSubjects = [
    {
      id: 1,
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
      id: 2,
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
      id: 1,
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
      id: 1,
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
      id: 1,
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
      id: 1,
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
      id: 1,
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
      ])),
      electiveSubjects,
    },
  };
};

export default ElectivePage;
