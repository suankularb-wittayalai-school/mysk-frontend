import { FormControlValues } from "@/utils/types/common";
import { usePlausible } from "next-plausible";
import { pascal, snake } from "radash";

export default function useTrackSearch() {
  const plausible = usePlausible();

  /**
   * Track a Search Fitlers event.
   *
   * @param eventName The name of the event.
   * @param filters The filters used in the Search. `form` in `useForm`.
   * @param count Number of non-empty filters.
   */
  return (
    eventName: string,
    filters: FormControlValues,
    count: number,
  ) =>
    plausible(eventName, {
      props: {
        filterCount: count,
        ...Object.fromEntries(
          Object.keys(filters).map((key) => [
            "include" + pascal(snake(key)),
            Boolean(filters[key]),
          ]),
        ),
      },
    });
}
