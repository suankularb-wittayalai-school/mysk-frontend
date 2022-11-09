// External libraries
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useMemo, useState } from "react";

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  ChipRadioGroup,
  Header,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import DataTableBody from "@components/data-table/DataTableBody";
import DataTableHeader from "@components/data-table/DataTableHeader";

// Types
import { LangCode } from "@utils/types/common";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { animationTransition } from "@utils/animations/config";
import { Role } from "@utils/types/person";

const StatisticsSection: FC = () => {
  const { t } = useTranslation("admin");
  const [countRequest, setCountRequest] = useState<"complete" | "incomplete">(
    "complete"
  );

  const statistics = {
    teacher: {
      complete: 239,
      full: 241,
    },
    student: {
      complete: 0,
      full: 3168,
    },
  };

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="data_usage" allowCustomSize />}
        text="Statistics"
      />
      <ChipRadioGroup
        choices={[
          { id: "complete", name: "Complete" },
          { id: "incomplete", name: "Incomplete" },
        ]}
        onChange={setCountRequest}
        required
        value="complete"
      />
      <LayoutGridCols cols={2}>
        {["teacher", "student"].map((role) => (
          <Card key={role} type="stacked" appearance="outlined">
            <CardHeader title={<h3>Teachers onboarded</h3>} />
            <p className="px-4 pb-2 font-display">
              <span className="text-6xl font-bold">
                {countRequest == "incomplete"
                  ? statistics[role as Role].full -
                    statistics[role as Role].complete
                  : statistics[role as Role].complete}
              </span>
              <span className="text-4xl">/</span>
              <span className="text-xl">
                {statistics[role as Role].full} teachers
              </span>
            </p>
          </Card>
        ))}
      </LayoutGridCols>
    </Section>
  );
};

const IndividualStatusSection: FC = () => {
  const { t } = useTranslation("admin");

  const teachers = [
    {
      id: 1,
      name: "Boonsup Wattanapornmongkol",
      dataChecked: true,
      passwordSet: false,
    },
  ];

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="group" allowCustomSize />}
        text="Teacher onboarding status"
      />
      <LayoutGridCols cols={3}>
        <ul className="contents">
          <LayoutGroup>
            <AnimatePresence initial={false}>
              {teachers.map((teacher) => (
                <motion.li
                  key={teacher.id}
                  initial={{ scale: 0.8, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, y: 20, opacity: 0 }}
                  layoutId={`teacher-${teacher.id}`}
                  transition={animationTransition}
                >
                  <Card type="horizontal" appearance="tonal">
                    <CardHeader
                      title={<h3 className="!break-all">{teacher.name}</h3>}
                      label={
                        <div className="!flex flex-row items-center gap-1">
                          {teacher.passwordSet ? (
                            <>
                              <MaterialIcon
                                icon="password"
                                className="text-primary"
                              />
                              <span>Password set</span>
                            </>
                          ) : teacher.dataChecked ? (
                            <>
                              <MaterialIcon
                                icon="badge"
                                className="text-primary"
                              />
                              <span>Data checked</span>
                            </>
                          ) : (
                            <>
                              <MaterialIcon
                                icon="block"
                                className="text-primary"
                              />
                              <span>No steps completed</span>
                            </>
                          )}
                        </div>
                      }
                      end={
                        <Button
                          name="Delete user"
                          type="text"
                          icon={<MaterialIcon icon="delete" />}
                          iconOnly
                          isDangerous
                        />
                      }
                    />
                  </Card>
                </motion.li>
              ))}
            </AnimatePresence>
          </LayoutGroup>
        </ul>
      </LayoutGridCols>
    </Section>
  );
};

const OnboardingStatus: NextPage = () => {
  const { t } = useTranslation("admin");

  return (
    <>
      <Head>
        <title>{createTitleStr("Onboarding status", t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: "Onboarding status" }}
            pageIcon={<MaterialIcon icon="waving_hand" />}
            backGoesTo="/admin"
            LinkElement={Link}
          />
        }
      >
        <StatisticsSection />
        <IndividualStatusSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "account",
      ])),
    },
  };
};

export default OnboardingStatus;
