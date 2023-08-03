import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Subject } from "@/utils/types/subject";
import { SortingState } from "@tanstack/react-table";

export async function getSubjectsForAdmin(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string,
  sorting?: SortingState,
): Promise<
  BackendReturn<Pick<Subject, "id" | "name" | "code">[]> & {
    count: number;
  }
> {
  const { data, count, error } = await supabase
    .from("subjects")
    .select("*", { count: "exact" })
    .or(
      [
        `code_th.like.%${query || ""}%`,
        `name_th.like.%${query || ""}%`,
        `code_en.ilike.%${query || ""}%`,
        `name_en.ilike.%${query || ""}%`,
        query &&
          /^[1-9][0-9]{3}$/.test(query) &&
          `year.eq.${query}, year.eq.${Number(query) - 543}`,
        query && ["1", "2"].includes(query) && `semester.eq.${query}`,
      ]
        .filter((segment) => segment)
        .join(","),
    )
    .order(
      (sorting?.length
        ? {
            codeTH: "code_th",
            nameTH: "name_th",
            codeEN: "code_en",
            nameEN: "name_en",
          }[sorting[0].id]!
        : "code_th") as "code_th" | "name_th" | "code_en" | "name_en",
      { ascending: !sorting?.[0]?.desc },
    )
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (error) {
    logError("getAdminSubjectList", error);
    return { data: null, count: 0, error };
  }

  return {
    data: data.map((subject) => ({
      id: subject!.id,
      code: mergeDBLocales(subject, "code"),
      name: mergeDBLocales(subject, "name"),
    })),
    count: count!,
    error,
  };
}
