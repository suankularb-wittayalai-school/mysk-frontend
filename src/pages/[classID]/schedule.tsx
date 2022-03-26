// Modules
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/Schedule";

// Types
import { Schedule as ScheduleType } from "@utils/types/schedule";

const Subjects: NextPage<{ schedule: ScheduleType }> = ({ schedule }) => {
  const { t } = useTranslation("schedule");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("title.student") }}
          pageIcon={<MaterialIcon icon="dashboard" />}
          backGoesTo="/home"
          LinkElement={Link}
        />
      }
    >
      <Schedule schedule={schedule} />
    </RegularLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ classID: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const schedule: ScheduleType = {
    content: [
      {
        day: 1,
        content: [
          { periodStart: 1, duration: 1 },
          {
            periodStart: 2,
            duration: 1,
            subject: {
              name: {
                "en-US": {
                  name: "Chemistry",
                  shortName: "Chem",
                },
                th: {
                  name: "เคมี",
                  shortName: "เคมี",
                },
              },
              teachers: [
                {
                  id: 8,
                  role: "teacher",
                  prefix: "mister",
                  name: {
                    "en-US": {
                      firstName: "Thanthapatra",
                      lastName: "Bunchuay",
                    },
                    th: {
                      firstName: "ธันฐภัทร",
                      lastName: "บุญช่วย",
                    },
                  },
                  subjectsInCharge: [],
                },
              ],
              subjectSubgroup: {
                name: {
                  "en-US": "Science",
                  th: "วิทยาศาสตร์",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Science and Technology",
                    th: "วิทยาศาสตร์และเทคโนโลยี",
                  },
                },
              },
            },
          },
        ],
      },
      {
        day: 2,
        content: [],
      },
      {
        day: 3,
        content: [],
      },
      {
        day: 4,
        content: [],
      },
      {
        day: 5,
        content: [],
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale == "en-US" ? "en-US" : "th", [
        "common",
        "schedule",
      ])),
      schedule,
    },
  };
};

export default Subjects;
