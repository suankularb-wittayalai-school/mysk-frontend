import { BackendDataReturn, DatabaseClient } from "@utils/types/common";
import { VaccineRecord } from "@utils/types/vaccine";

export async function getVaccineRecordbyPersonId(
  supabase: DatabaseClient,
  personId: number
): Promise<VaccineRecord[]> {
  const { data, error } = await supabase
    .from("vaccine_records")
    .select("*")
    .eq("person", personId)
    .order("vaccination_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (
    data.map((vaccineRecord, index) => ({
      id: vaccineRecord.id,
      doseNo: index + 1,
      vaccineName: vaccineRecord.vaccine_name,
      vaccineDate: new Date(vaccineRecord.vaccination_date),
      lotNo: vaccineRecord.lot_no,
      administeredBy: vaccineRecord.administering_center,
    })) ?? []
  );
}

export async function addVaccineRecord(
  supabase: DatabaseClient,
  vaccineRecord: VaccineRecord,
  personId: number
): Promise<void> {
  const { error } = await supabase.from("vaccine_records").insert([
    {
      person: personId,
      vaccine_name: vaccineRecord.vaccineName,
      vaccination_date: vaccineRecord.vaccineDate.toDateString(),
      lot_no: vaccineRecord.lotNo,
      administering_center: vaccineRecord.administeredBy,
    },
  ]);

  if (error) {
    throw error;
  }
}

export async function deleteVaccineRecord(
  supabase: DatabaseClient,
  vaccineRecordId: number
): Promise<void> {
  const { error } = await supabase
    .from("vaccine_records")
    .delete()
    .eq("id", vaccineRecordId);

  if (error) {
    throw error;
  }
}

export async function updateVaccineRecords(
  supabase: DatabaseClient,
  vaccineRecords: VaccineRecord[],
  personId: number
): Promise<BackendDataReturn<VaccineRecord[]>> {
  const dbVaccineRecords = vaccineRecords.map((vaccineRecord) => ({
    id: vaccineRecord.id,
    person: personId,
    vaccine_name: vaccineRecord.vaccineName,
    vaccination_date: vaccineRecord.vaccineDate.toDateString(),
    lot_no: vaccineRecord.lotNo,
    administering_center: vaccineRecord.administeredBy,
  }));

  const { data, error } = await supabase
    .from("vaccine_records")
    .upsert(dbVaccineRecords, { onConflict: "id" });

  return { data: [], error };
}
