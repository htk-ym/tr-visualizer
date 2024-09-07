import { usePageMutator, usePageSelector } from "@/_store/PageState";
import { useViewStateSelectors } from "@/_store/ViewState";

type State = {
  isSidebarOpen: boolean,
  pageIds: number[],
  pageIdNameTaple: { pageID: number, name: string }[],
  selectedPageID: number
}

type Action = {
  onClickItem: (pageID: number) => void
  onClickAddButton: () => void
}

export const useSidebarViewModel: ViewModelFunc<State, Action> = () => {

  // store
  const viewStateSelectors = useViewStateSelectors();
  const pageIDSelector = usePageSelector();
  const pageIdMutator = usePageMutator();

  //exposed state
  const isSidebarOpen = viewStateSelectors.isSidebarOpen;
  const pageIds = pageIDSelector.ids;
  const pageIdNameTaple = pageIDSelector.idNameTaple;
  const selectedPageID = pageIDSelector.selectedPage;

  // exposed action
  const onClickItem = (pageID: number) => {
    pageIdMutator.load(pageID);
  }

  const onClickAddButton = () => {
    pageIdMutator.add();
  }

  return {
    state: {
      isSidebarOpen: isSidebarOpen,
      pageIds: pageIds,
      pageIdNameTaple: pageIdNameTaple,
      selectedPageID: selectedPageID
    },
    action: {
      onClickItem: onClickItem,
      onClickAddButton: onClickAddButton
    }
  }
}