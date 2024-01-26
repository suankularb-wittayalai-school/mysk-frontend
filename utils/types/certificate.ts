/**
 * The type (รายการ) of a Student Certificate.
 *
 * For example, `CertificateType.academic` corresponds to
 * “นักเรียนดีเด่นด้านวิชาการ.”
 */
export enum StudentCertificateType {
  studentOfTheYear = "student_of_the_year",
  excellentStudent = "excellent_student",
  academic = "academic",
  morale = "morale",
  sports = "sports",
  activity = "activity",
}

/**
 * A Student Certificate.
 *
 * A Certificate is identified by its type (รายการ) and detail (ประเภท). Type is
 * self-explanatory; detail dives deeper into the type, often giving the reason
 * why the Student is awarded the Certificate.
 *
 * For example, a Student awarded the type “นักเรียนดีเด่นด้านกิจกรรม” may have the
 * detail “คณะกรรมการนักเรียน” if they’re involved in Kornor.
 */
export type StudentCertificate = {
  id: string;
  year: number;
  certificate_type: StudentCertificateType;
  certificate_detail: string;
  receiving_order_number: number | null;
  seat_code: string | null;
};
