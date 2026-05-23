import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";
import { Organization } from "@/utils/types/organization";
import { Student, Teacher } from "@/utils/types/person";

export async function getStudentFromUserID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  userID: string,
  options?: Parameters<typeof getStudentByID>[3],
): Promise<BackendReturn<Student>> {
  let { data: studentData, error: studentDataError } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (studentDataError) {
    logError("getStudentFromUserID", studentDataError);
    return { data: null, error: studentDataError };
  }

  return await getStudentByID(supabase, mysk, studentData!.id, options);
}

export async function getTeacherFromUserID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  userID: string,
  options?: Parameters<typeof getTeacherByID>[3],
): Promise<BackendReturn<Teacher>> {
  let { data: teacherData, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    logError("getTeacherFromUserID (teacher)", error);
    return { data: null, error };
  }

  return await getTeacherByID(supabase, mysk, teacherData!.id, options);
}

export async function getOrganizationFromUserID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  userID: string,
): Promise<BackendReturn<Organization>> {
  let { data: organizationData, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    logError("getOrganizationFromUserID (Organization)", error);
    return { data: null, error };
  }

  const organization: Organization = {
    id: organizationData!.id,
    name: mergeDBLocales(organizationData, "name"),
    description: mergeDBLocales(organizationData, "description"),
    logo_url: organizationData?.logo_url ?? "",
    main_room: organizationData?.main_room ?? null,
    rooms: [],
  };

  return { data: organization, error };
}

export default async function getLoggedInPerson(
  supabase: DatabaseClient,
  mysk: MySKClient,
  options?: Parameters<
    typeof getStudentFromUserID | typeof getTeacherFromUserID
  >[3],
): Promise<BackendReturn<Student | Teacher>> {
  const { user } = mysk;
  return await {
    student: getStudentFromUserID,
    teacher: getTeacherFromUserID,
    organization: getOrganizationFromUserID,
  }[user!.role as (Student | Teacher)["role"]](
    supabase,
    mysk,
    user!.id,
    options,
  );
}
