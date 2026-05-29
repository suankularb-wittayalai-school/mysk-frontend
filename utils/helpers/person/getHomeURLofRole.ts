import { UserRole } from "@/utils/types/person";

/**
 * Get the home URL of a user role.
 *
 * @param role The user role.
 *
 * @returns The path to the home URL of the user role.
 */
export default function getHomeURLofRole(role: UserRole) {
  switch (role) {
    case UserRole.student:
      return "/learn";
    case UserRole.teacher:
      return "/teach";
    case UserRole.management:
      return "/manage";
    /* Default organization to /club. Don't know what else its use for
     and /organization doesn't exist */
    case UserRole.organization:
      return "/club";
    case UserRole.staff:
      return "/staff";
    default:
      return "/";
  }
}
