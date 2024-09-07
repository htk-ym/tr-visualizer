/**
 * コンポーネントの表示状態を管理する
 */

import { RecoilKeys } from "@/_type/RecoilKeys";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

// ===  Mutator  ================================================================================
export const useViewStateMutators = () => {

  const setIsCustomAddRowDialogOpen = useSetRecoilState(isCustomAddRowDialogOpenAtom);
  const setIsSidebarOpen = useSetRecoilState(isSidebarOpenAtom);

  return {
    openAddCustomRowDialog: () => setIsCustomAddRowDialogOpen(true),
    closeAddCustomRowDialog: () => setIsCustomAddRowDialogOpen(false),
    openSidebar: () => setIsSidebarOpen(true),
    closeSidebar: () => setIsSidebarOpen(false),
    toggleSidebar: () => setIsSidebarOpen((state) => !state),
  }
}

// ===  Selector  ================================================================================
export const useViewStateSelectors = () => {

  const isCustomAddRowDialogOpen = useRecoilValue(isCustomAddRowDialogOpenAtom);
  const isSidebarOpen = useRecoilValue(isSidebarOpenAtom);

  return {
    isCustomAddRowDialogOpen: isCustomAddRowDialogOpen,
    isSidebarOpen: isSidebarOpen,
  }
}

// ===  Recoil Atom / Selector  ================================================================================

// カスタム行追加ダイアログが表示されているか
const isCustomAddRowDialogOpenAtom = atom<boolean>({
  key: RecoilKeys.IS_CUSTOM_ADD_ROW_DIALOG_OPEN,
  default: false,
});

// サイドバーが表示されているか
const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarOpenRecoilState",
  default: true,
});