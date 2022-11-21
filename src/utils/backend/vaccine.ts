import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
} from "@utils/types/common";
import { VaccineRecord } from "@utils/types/vaccine";

export async function getVaccineRecordbyPersonId(
  supabase: DatabaseClient,
  personId: number
): Promise<BackendDataReturn<VaccineRecord[]>> {
  const { data, error } = await supabase
    .from("vaccine_records")
    .select("*")
    .eq("person", personId)
    .order("vaccination_date", { ascending: true });

  if (error) {
    // throw error;
    // console.error(error);
    return { data: [], error };
  }

  const vaccineRecord =
    data!.map((vaccineRecord, index) => ({
      id: vaccineRecord.id,
      doseNo: index + 1,
      vaccineName: vaccineRecord.vaccine_name,
      vaccineDate: vaccineRecord.vaccination_date,
      lotNo: vaccineRecord.lot_no,
      administeredBy: vaccineRecord.administering_center,
    })) ?? [];

  return { data: vaccineRecord, error: null };
}

export async function addVaccineRecord(
  supabase: DatabaseClient,
  vaccineRecord: VaccineRecord,
  personId: number
): Promise<BackendReturn> {
  const { error } = await supabase.from("vaccine_records").insert([
    {
      person: personId,
      vaccine_name: vaccineRecord.vaccineName,
      vaccination_date: vaccineRecord.vaccineDate,
      lot_no: vaccineRecord.lotNo,
      administering_center: vaccineRecord.administeredBy,
    },
  ]);

  return { error };
}

export async function deleteVaccineRecord(
  supabase: DatabaseClient,
  vaccineRecordId: number
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("vaccine_records")
    .delete()
    .eq("id", vaccineRecordId);

  return { error };
}

export async function updateVaccineRecords(
  supabase: DatabaseClient,
  vaccineRecords: VaccineRecord[],
  personId: number
): Promise<BackendReturn> {
  const dbVaccineRecords = vaccineRecords.map((vaccineRecord) => ({
    id: vaccineRecord.id,
    person: personId,
    vaccine_name: vaccineRecord.vaccineName,
    vaccination_date: vaccineRecord.vaccineDate,
    lot_no: vaccineRecord.lotNo,
    administering_center: vaccineRecord.administeredBy,
  }));

  const { data, error } = await supabase
    .from("vaccine_records")
    .upsert(dbVaccineRecords, { onConflict: "id" });

  return { error };
}
