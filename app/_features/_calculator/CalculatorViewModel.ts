import { useViewStateMutators, useViewStateSelectors } from "@/_store/ViewState"
import { useViewRangeHourMutators, useViewRangeHourSelectors } from "@/_store/ViewRangeHourState"
import { useTRRowIDsMutator, useTRRowIDsSelector } from "@/_store/TRRowsState"

type State = {
  isCustomAddRowDialogOpen: boolean,
  sortedRowIDs: number[],
  viewRangeHourStartTime: string,
  viewRangeHourEndTime: string,
  viewRangeHourStartTimeOptions: string[],
  viewRangeHourEndTimeOptions: string[]
}

type Action = {
  addRow: () => void,
  openCustomAddRowDialog: () => void,
  setViewRangeHourStartTime: (value: string) => void,
  setViewRangeHourEndTime: (value: string) => void
}

export const useCalculatorViewModel: ViewModelFunc<State, Action> = () => {

  // store
  const viewRangeHourMutators = useViewRangeHourMutators();
  const viewRangeHourSelectors = useViewRangeHourSelectors();
  const trRowIDsMutator = useTRRowIDsMutator();
  const trRowIDsSelector = useTRRowIDsSelector();
  const viewStateMutators = useViewStateMutators();
  const viewStateSelectors = useViewStateSelectors();

  // exposed state
  const isCustomAddRowDialogOpen = viewStateSelectors.isCustomAddRowDialogOpen;
  const sortedRowIDs = trRowIDsSelector.ids.slice().sort();
  const viewRangeHourStartTime = `${viewRangeHourSelectors.viewRangeHourStartTime}:00`;
  const viewRangeHourEndTime = `${viewRangeHourSelectors.viewRangeHourEndTime}:00`;
  const viewRangeHourStartTimeOptions = viewRangeHourSelectors.viewRangeHourStartTimeOptions;
  const viewRangeHourEndTimeOptions = viewRangeHourSelectors.viewRangeHourEndTimeOptions;

  // exposed action
  const addRow = () => trRowIDsMutator.addRow();

  const openCustomAddRowDialog = () => viewStateMutators.openAddCustomRowDialog();

  const setViewRangeHourStartTime = (value: string) => {
    const hour = parseInt(value.split(":")[0]);
    viewRangeHourMutators.setViewRangeHourStartTime(hour);
  }

  const setViewRangeHourEndTime = (value: string) => {
    const hour = parseInt(value.split(":")[0]);
    viewRangeHourMutators.setViewRangeHourEndTime(hour);
  }

  return {
    state: {
      isCustomAddRowDialogOpen,
      sortedRowIDs,
      viewRangeHourStartTime,
      viewRangeHourEndTime,
      viewRangeHourStartTimeOptions,
      viewRangeHourEndTimeOptions
    },
    action: {
      addRow,
      openCustomAddRowDialog,
      setViewRangeHourStartTime,
      setViewRangeHourEndTime
    }
  }
}