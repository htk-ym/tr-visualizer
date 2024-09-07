
import { usePageMutator, usePageSelector } from "@/_store/PageState";
import { useViewStateMutators } from "@/_store/ViewState";

type State = {
  title: string
}

type Action = {
  toggleSideBar: () => void,
  changeTitle: (title: string) => void,
  deleteItem: () => void
}

export const usePageHeaderViewModel: ViewModelFunc<State, Action> = () => {

  // store
  const pageMutator = usePageMutator();
  const pageSelector = usePageSelector();
  const viewStateMutators = useViewStateMutators();

  // exposed state
  const title = pageSelector.selectedPageTitle;

  // exposed action
  const toggleSideBar = () => viewStateMutators.toggleSidebar();

  const changeTitle = (title: string) => pageMutator.changeTitle(title);

  const deleteItem = () => pageMutator.delete();

  return {
    state: {
      title: title
    },
    action: {
      toggleSideBar: toggleSideBar,
      changeTitle: changeTitle,
      deleteItem: deleteItem
    }
  }
}