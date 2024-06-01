import useBreakpoint, { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { BackendReturn } from "@/utils/types/backend";
import { first } from "radash";
import { useEffect, useState } from "react";

/**
 * A hook that manages a
 * {@link https://m3.material.io/foundations/layout/canonical-layouts/list-detail List-detail View}.
 *
 * @param list The list of items to display. Each item must have an `id` property.
 * @param fetch The function to fetch the detail of an item.
 *
 * @param options Options.
 * @param options.initialID The ID of the item to select initially. Overrides `firstByDefault`.
 * @param options.firstByDefault Whether to select the first item by default.
 * @param options.initialSelectDelay The delay in seconds to select the initial item.
 * @param options.dialogBreakpoints The Breakpoints to open the details dialog.
 *
 * @returns
 * | Property           | Description                                                  |
 * | ------------------ | ------------------------------------------------------------ |
 * | `selectedID`       | The ID of the selected item, used in the list side.          |
 * | `selectedDetail`   | The detail of the selected item, used in the detail side.    |
 * | `onSelectedChange` | Selects an ID from the list and fetch its detail.            |
 * | `refreshDetail`    | Refreshes the detail of the selected item. Requires `fetch`. |
 * | `detailsOpen`      | Whether the details dialog is open.                          |
 * | `onDetailsClose`   | Closes the details dialog.                                   |
 */
export default function useListDetail<
  /** An item in the list side. */
  CompactItem extends { id: string },
  /** An item in the detail side. Defaults to `CompactItem`. */
  DetailedItem extends CompactItem = CompactItem,
>(
  list: CompactItem[],
  fetch:
    | ((id: string) => Promise<BackendReturn<DetailedItem>>)
    | undefined = undefined,
  options: Partial<{
    initialID: string;
    firstByDefault: boolean;
    initialSelectDelay: number;
    dialogBreakpoints: Breakpoint[];
  }> = {},
) {
  const {
    initialID: preferredInitialID,
    firstByDefault,
    initialSelectDelay,
    dialogBreakpoints,
  } = options;

  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DetailedItem | null>(
    null,
  );

  // Initially selected item.
  useEffect(() => {
    // Get what ID should be the default selected ID based on the given options.
    const initialID =
      preferredInitialID || (firstByDefault && list.length && first(list)!.id);
    if (!initialID) return;

    // Select the initial ID immediately or after a delay.
    if (!initialSelectDelay) {
      onSelectedChange(initialID);
      return;
    }
    const timeout = setTimeout(
      () => onSelectedChange(initialID),
      initialSelectDelay * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  // Open the details dialog on the given breakpoints, otherwise close it.
  const { breakpoint } = useBreakpoint();
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    if (!(breakpoint !== null && dialogBreakpoints)) return;
    if (!dialogBreakpoints.includes(breakpoint)) setDetailsOpen(false);
    else if (selectedID) setDetailsOpen(true);
  }, [breakpoint]);

  /**
   * Selects an ID from the list and fetch its detail.
   * @param id The ID to select.
   */
  async function onSelectedChange(id: string) {
    setSelectedID(id);
    if (!fetch) {
      onDetailsOpen();
      setSelectedDetail(list.find((item) => item.id === id) as DetailedItem);
      return;
    }
    setSelectedDetail(null);
    onDetailsOpen();
    const { data, error } = await fetch(id);
    if (error) return;
    setSelectedDetail(data);
  }

  /** Refreshes the detail of the selected item. Requires `fetch`. */
  async function refreshDetail() {
    if (!(fetch && selectedID)) return;
    const { data, error } = await fetch(selectedID);
    if (error) return;
    setSelectedDetail(data);
  }

  /** Opens the details dialog. */
  function onDetailsOpen() {
    if (breakpoint !== null && dialogBreakpoints?.includes(breakpoint))
      setDetailsOpen(true);
  }

  /** Closes the details dialog. */
  function onDetailsClose() {
    setDetailsOpen(false);
  }

  return {
    /** The ID of the selected item, used in the list side. */
    selectedID,
    /** The detail of the selected item, used in the detail side. */
    selectedDetail,
    /**
     * Select an ID from the list and fetch its detail.
     * @param id The ID to select.
     */
    onSelectedChange,
    /**
     * Refreshes the detail of the selected item. Requires `fetch`.
     * 
     * This is useful when you want to refresh the detail after an action
     * without `selectedDetail` flashing to `null`.
     */
    refreshDetail,
    /** Whether the details dialog is open. */
    detailsOpen,
    /** Closes the details dialog. */
    onDetailsClose,
  };
}
