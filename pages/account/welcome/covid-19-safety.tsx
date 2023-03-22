// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useEffect, useReducer, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Role } from "@/utils/types/person";
import { VaccineRecord } from "@/utils/types/vaccine";

const ProviderSelect: FC<Partial<SelectProps>> = (props?) => (
  // Information from https://covid19.trackvaccines.org/country/thailand/
  <Select appearance="outlined" label="Provider" {...props}>
    <MenuItem value="comirnaty">Comirnaty (Pfizer)</MenuItem>
    <MenuItem value="coronavac">CoronaVac (Sinovac)</MenuItem>
    <MenuItem value="vaxzevria">Vaxzevria (AstraZeneca)</MenuItem>
    <MenuItem value="spikevax">Spikevax (Moderna)</MenuItem>
    <MenuItem value="jcovden">Jcovden (J&J)</MenuItem>
    <MenuItem value="covilo">Covilo (Sinopharm)</MenuItem>
    <MenuItem value="covovax">COVOVAX (Novavax formulation)</MenuItem>
  </Select>
);

const AddDoseSection: FC<{ addDose: (dose: VaccineRecord) => void }> = ({
  addDose,
}) => {
  // Translation
  const { t } = useTranslation("welcome");

  // Form control
  const [counter, incrementCounter] = useReducer(
    (counter: number) => counter + 1,
    1
  );
  const { form, formOK, formProps } = useForm<"vaccineDate" | "provider">([
    { key: "vaccineDate", required: true },
    { key: "provider", required: true },
  ]);

  return (
    <Card appearance="outlined">
      <CardHeader title="Add a dose" />
      <CardContent>
        <p>
          Enter your vaccination info exactly as seen in the Mor Prom app. You
          can see it by opening the Mor Prom app &gt; Log in &gt; Tap “Health
          Certificate” &gt; Tap “Vaccination of COVID-19”
        </p>
        <p>
          Your vaccine data will only be used in the compilation of school
          statistics. No one can read your vaccination info except the school.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <TextField
            appearance="outlined"
            label="Date of vaccination"
            inputAttr={{ type: "date" }}
            {...formProps.vaccineDate}
          />
          <ProviderSelect {...formProps.provider} />
        </div>
        <Actions>
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="arrow_forward" />}
            onClick={() => {
              if (!formOK) return;
              addDose({ id: counter, ...form });
              incrementCounter();
            }}
          >
            Add dose
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

const DoseCard: FC<{
  dose: VaccineRecord;
  idx: number;
  setDose: (dose: Pick<VaccineRecord, "vaccineDate" | "provider">) => void;
  removeDose: () => void;
}> = ({ dose, idx, setDose, removeDose }) => {
  // Translation
  const { t } = useTranslation("welcome");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Form control
  const { form, formProps } = useForm<"vaccineDate" | "provider">([
    { key: "vaccineDate", defaultValue: dose.vaccineDate, required: true },
    { key: "provider", defaultValue: dose.provider, required: true },
  ]);
  useEffect(() => setDose(form), [form]);

  return (
    <motion.div
      key={dose.id}
      initial={{ x: -100, scale: 0.6, opacity: 0 }}
      animate={{ x: 0, scale: 1, opacity: 1 }}
      exit={{
        x: -100,
        scale: 0.8,
        opacity: 0,
        transition: transition(duration.short4, easing.emphasizedAccelerate),
      }}
      layoutId={["dose", dose.id].join("-")}
      transition={transition(duration.medium2, easing.standard)}
    >
      <Card appearance="filled">
        <div className="flex flex-row items-center">
          <CardHeader title={`Dose ${idx + 1}`} className="grow" />
          <div className="mx-4">
            <Button
              appearance="text"
              icon={<MaterialIcon icon="delete" />}
              dangerous
              onClick={removeDose}
            />
          </div>
        </div>
        <CardContent>
          <div className="my-4 grid grid-cols-2 gap-6">
            <TextField
              appearance="filled"
              label="Date of vaccination"
              inputAttr={{ type: "date" }}
              {...formProps.vaccineDate}
            />
            <ProviderSelect appearance="filled" {...formProps.provider} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DoseCardList: FC<{
  doses: VaccineRecord[];
  setDoses: (doses: VaccineRecord[]) => void;
}> = ({ doses, setDoses }) => (
  <LayoutGroup>
    <AnimatePresence>
      {doses.map((dose, idx) => (
        <DoseCard
          key={dose.id}
          idx={idx}
          dose={dose}
          setDose={(dose) =>
            setDoses(
              doses
                // Replace dose with new information
                .map((mapDose, mapIdx) =>
                  idx === mapIdx ? { ...mapDose, ...dose } : mapDose
                )
                // Sort doses by date
                .sort((a, b) =>
                  new Date(b.vaccineDate) <= new Date(a.vaccineDate) ? 1 : -1
                )
            )
          }
          removeDose={() =>
            setDoses(doses.filter((_, filterIdx) => idx !== filterIdx))
          }
        />
      ))}
    </AnimatePresence>
  </LayoutGroup>
);

const COVID19SafetyPage: CustomPage<{ userRole: Role }> = ({ userRole }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  // Animation
  const { duration, easing } = useAnimationConfig();

  const [doses, setDoses] = useState<VaccineRecord[]>([]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Welcome", t)}</title>
      </Head>
      <ContentLayout>
        <Card
          appearance="outlined"
          className="mx-4 !flex-row gap-3 py-3 px-4 sm:mx-0"
        >
          <MaterialIcon icon="warning" className="text-error" />
          <p>Remember: your information is not saved until you press “Next.”</p>
        </Card>
        <Section>
          <Header>Vaccination</Header>
          <Columns
            columns={2}
            className={!doses.length ? "!items-stretch" : undefined}
          >
            <AddDoseSection
              addDose={(dose) =>
                setDoses(
                  [...doses, dose].sort((a, b) =>
                    new Date(b.vaccineDate) <= new Date(a.vaccineDate) ? 1 : -1
                  )
                )
              }
            />
            <AnimatePresence initial={false} mode="wait">
              {doses.length ? (
                <ul className="flex flex-col gap-3">
                  <DoseCardList doses={doses} setDoses={setDoses} />
                </ul>
              ) : (
                <motion.div
                  className="h-20 sm:h-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={transition(duration.medium2, easing.standard)}
                >
                  <Card
                    appearance="outlined"
                    className="!grid h-full place-content-center"
                  >
                    <p className="skc-body-medium text-on-surface-variant">
                      No vaccination data added yet.
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Columns>
        </Section>
        <Actions className="mx-4 pb-36 sm:mx-0">
          <Button
            appearance="filled"
            href={
              userRole === "teacher"
                ? "/account/welcome/your-subjects"
                : "/account/welcome/logging-in"
            }
            element={Link}
          >
            Next
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  const userRole = metadata!.role;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      userRole,
    },
  };
};

COVID19SafetyPage.pageHeader = {
  title: { key: "covid19Safety.title", ns: "welcome" },
  icon: <MaterialIcon icon="vaccines" />,
  parentURL: "/account/welcome/your-information",
};

COVID19SafetyPage.childURLs = [
  "/account/welcome/your-subjects",
  "/account/welcome/logging-in",
];

export default COVID19SafetyPage;
