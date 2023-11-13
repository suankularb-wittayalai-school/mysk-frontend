/**
 * Create an OR query from a full name string. Should be used in Search.
 *
 * @param fullName Full name string to be used in the query.
 *
 * @returns An OR query string.
 *
 * @example
 *
 * ```ts
 * query = query.or(
 *  createOrQueryFromFullName(filters.fullName),
 *  { foreignTable: "people" },
 * );
 * ```
 */
export default function createOrQueryFromFullName(fullName: string) {
  const nameSegments = fullName.split(" ");
  const nameFilter =
    nameSegments.length > 1
      ? {
          firstName: nameSegments?.[0],
          ...(nameSegments.length > 2
            ? {
                middleName: nameSegments[1],
                lastName: nameSegments.slice(2).join(" "),
              }
            : {
                middleName: "",
                lastName: nameSegments?.slice(1).join(" "),
              }),
        }
      : { firstName: fullName, middleName: fullName, lastName: fullName };

  return `first_name_th.${nameSegments.length > 1 ? "eq" : "like"}.%${
    nameFilter.firstName
  }%, \
    middle_name_th.${nameSegments.length > 1 ? "eq" : "like"}.%${
      nameFilter.middleName
    }%, \
    last_name_th.like.%${nameFilter.lastName}%, \
    first_name_en.${nameSegments.length > 1 ? "eq" : "ilike"}.%${
      nameFilter.firstName
    }%, \
    middle_name_en.${nameSegments.length > 1 ? "eq" : "ilike"}.%${
      nameFilter.middleName
    }%, \
    last_name_en.ilike.%${nameFilter.lastName}%`;
}

