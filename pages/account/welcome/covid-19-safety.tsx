// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useEffect, useReducer, useState } from "react";

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
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import NextWarningCard from "@/components/welcome/NextWarningCard";

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
import {
  getVaccineRecordbyPersonId as getVaccineRecordbyPersonID,
  updateVaccineRecords,
} from "@/utils/backend/vaccine";
import { getPersonIDFromUser } from "@/utils/backend/person/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/types/supabase";
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";
import { useRouter } from "next/router";
import SnackbarContext from "@/contexts/SnackbarContext";

const ProviderSelect: FC<Partial<SelectProps>> = (props?) => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    // Information from https://covid19.trackvaccines.org/country/thailand/
    <Select
      appearance="outlined"
      label={t("covid19Safety.vaccination.dose.provider")}
      {...props}
    >
      <MenuItem value="comirnaty">Comirnaty (Pfizer)</MenuItem>
      <MenuItem value="coronavac">CoronaVac (Sinovac)</MenuItem>
      <MenuItem value="vaxzevria">Vaxzevria (AstraZeneca)</MenuItem>
      <MenuItem value="spikevax">Spikevax (Moderna)</MenuItem>
      <MenuItem value="jcovden">Jcovden (J&J)</MenuItem>
      <MenuItem value="covilo">Covilo (Sinopharm)</MenuItem>
      <MenuItem value="covovax">COVOVAX (Novavax formulation)</MenuItem>
    </Select>
  );
};

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
  const { form, resetForm, openFormSnackbar, formOK, formProps } = useForm<
    "vaccineDate" | "provider"
  >([
    { key: "vaccineDate", required: true },
    { key: "provider", required: true },
  ]);

  return (
    <Card appearance="outlined">
      <CardHeader title={t("covid19Safety.vaccination.addDose.title")} />
      <CardContent>
        <p>
          <Trans i18nKey="covid19Safety.vaccination.addDose.desc" ns="welcome">
            <MaterialIcon
              icon="chevron_right"
              className="-mx-1 -mb-2 !inline-block"
            />
          </Trans>
        </p>
        <p>{t("covid19Safety.vaccination.addDose.usage")}</p>
        <Columns columns={2} className="mt-4 !gap-y-4">
          <TextField
            appearance="outlined"
            label={t("covid19Safety.vaccination.dose.date")}
            inputAttr={{ type: "date" }}
            {...formProps.vaccineDate}
          />
          <ProviderSelect {...formProps.provider} />
        </Columns>
        <Actions>
          <Button
            appearance="tonal"
            icon={
              <MaterialIcon icon="arrow_downward" className="sm:-rotate-90" />
            }
            onClick={() => {
              openFormSnackbar();
              if (!formOK) return;
              addDose({ id: counter, ...form });
              incrementCounter();
              resetForm();
            }}
          >
            {t("covid19Safety.vaccination.addDose.action.add")}
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
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0.8,
        opacity: 0,
        transition: transition(duration.short4, easing.emphasizedAccelerate),
      }}
      layoutId={["dose", dose.id].join("-")}
      transition={transition(duration.medium2, easing.standard)}
    >
      <Card appearance="filled">
        <div className="flex flex-row items-center">
          <CardHeader
            title={t("covid19Safety.vaccination.dose.doseNo", {
              doseNo: idx + 1,
            })}
            className="grow"
          />
          <div className="mx-4">
            <Button
              appearance="text"
              icon={<MaterialIcon icon="delete" />}
              alt={t("covid19Safety.vaccination.dose.action.delete")}
              dangerous
              onClick={removeDose}
            />
          </div>
        </div>
        <CardContent>
          <Columns columns={2} className="my-4">
            <TextField
              appearance="filled"
              label={t("covid19Safety.vaccination.dose.date")}
              inputAttr={{ type: "date" }}
              {...formProps.vaccineDate}
            />
            <ProviderSelect appearance="filled" {...formProps.provider} />
          </Columns>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DoseCardList: FC<{
  vaccineRecords: VaccineRecord[];
  setVaccineRecords: (vaccineRecords: VaccineRecord[]) => void;
}> = ({ vaccineRecords, setVaccineRecords }) => (
  <AnimatePresence initial={false}>
    {vaccineRecords.map((dose, idx) => (
      <DoseCard
        key={dose.id}
        idx={idx}
        dose={dose}
        setDose={(dose) =>
          setVaccineRecords(
            vaccineRecords
              // Replace dose with new information
              .map((mapDose, mapIdx) =>
                idx === mapIdx ? { ...mapDose, ...dose } : mapDose
              )
              // Sort vaccineRecords by date
              .sort((a, b) =>
                new Date(b.vaccineDate) <= new Date(a.vaccineDate) ? 1 : -1
              )
          )
        }
        removeDose={() =>
          setVaccineRecords(
            vaccineRecords.filter((_, filterIdx) => idx !== filterIdx)
          )
        }
      />
    ))}
  </AnimatePresence>
);

const COVID19SafetyPage: CustomPage<{
  userRole: Role;
  personID: number;
  vaccineRecords: VaccineRecord[];
}> = ({ userRole, personID, vaccineRecords: existingRecords }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Router
  const router = useRouter();

  // Supabase
  const supabase = useSupabaseClient<Database>();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const [vaccineRecords, setVaccineRecords] =
    useState<VaccineRecord[]>(existingRecords);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  function handleSubmit() {
    withLoading(async () => {
      const { error } = await updateVaccineRecords(
        supabase,
        vaccineRecords,
        personID
      );

      if (error) {
        console.error(error);
        setSnackbar(
          <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      if (userRole === "teacher") router.push("/account/welcome/your-subjects");
      else router.push("/account/welcome/logging-in");

      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("covid19Safety.title"), t)}</title>
      </Head>
      <ContentLayout>
        <NextWarningCard />
        <Section>
          <Header>{t("covid19Safety.vaccination.title")}</Header>

          <Columns
            columns={2}
            className={!vaccineRecords.length ? "!items-stretch" : undefined}
          >
            {/* Add side */}
            <AddDoseSection
              addDose={(dose) =>
                setVaccineRecords(
                  [...vaccineRecords, dose].sort((a, b) =>
                    new Date(b.vaccineDate) <= new Date(a.vaccineDate) ? 1 : -1
                  )
                )
              }
            />

            {/* List side */}
            <LayoutGroup>
              <AnimatePresence initial={false} mode="wait">
                {vaccineRecords.length ? (
                  // Vaccine record list
                  <motion.ul
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 1 }}
                    transition={transition(duration.medium2, easing.standard)}
                    className="flex flex-col gap-3"
                  >
                    <DoseCardList
                      vaccineRecords={vaccineRecords}
                      setVaccineRecords={setVaccineRecords}
                    />
                  </motion.ul>
                ) : (
                  // Placeholder for when there are no records
                  <motion.div
                    className="min-h-[5rem]"
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
                        {t("covid19Safety.vaccination.dose.noData")}
                      </p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </Columns>
        </Section>
        <Actions className="mx-4 pb-36 sm:mx-0">
          <Button
            appearance="filled"
            onClick={handleSubmit}
            loading={loading || undefined}
          >
            {t("common.action.next")}
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

  const { data: personID } = await getPersonIDFromUser(supabase, session!.user);

  const { data: vaccineRecords } = await getVaccineRecordbyPersonID(
    supabase,
    personID!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      userRole,
      personID,
      vaccineRecords,
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
