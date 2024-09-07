/**
 * ページごとのデータの永続化関連
 */

import { RecoilKeys } from "@/_type/RecoilKeys";
import { atom, atomFamily, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { localStoragePersistenceEffect } from "./LocalStoragePersistenceEffect";

// ===  Mutator  ================================================================================
export const usePageMutator = () => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const setPageID = useSetRecoilState(PageId);
  const setSelectedPageID = useSetRecoilState(SelectedPageID);
  const setSelectedPageTitle = useSetRecoilState(PageTitle(selectedPageID));


  return {
    add: () => {
      const newID = Date.now();
      setPageID((old) => [...old, newID]);
      setSelectedPageID(newID);
    },
    load: (pageID: number) => {
      setSelectedPageID(pageID);
    },
    delete: () => {
      setPageID((old) => old.filter((id) => id !== selectedPageID));
    },
    changeTitle: (title: string) => setSelectedPageTitle(title),


  };
}

// ===  Selector  ================================================================================
export const usePageSelector = () => {
  const ids = useRecoilValue(PageId);
  const selectedPage = useRecoilValue(SelectedPageID);

  return {
    ids: ids,
    selectedPage: selectedPage,
    selectedPageTitle: useRecoilValue(PageTitle(selectedPage)),
    idNameTaple: useRecoilValue(PageIDNameMapSelector),
  }
}

// ===  Recoil Atom / Selector  ================================================================================

const PageId = atom<number[]>({
  key: RecoilKeys.CALCULATE_PAGE_ID,
  default: [],
  effects: [
    localStoragePersistenceEffect<number[]>(RecoilKeys.CALCULATE_PAGE_ID, [Date.now()]),
  ]
});

const DefaultSelectedPageID = selector({
  key: RecoilKeys.DEFAULT_SELECTED_PAGE_ID,
  get: ({ get }) => {
    return get(PageId)[0];
  }
});

export const SelectedPageID = atom<number>({
  key: RecoilKeys.SELECTED_PAGE_ID,
  default: DefaultSelectedPageID,
  effects: [
    localStoragePersistenceEffect<number>(RecoilKeys.SELECTED_PAGE_ID),
  ]
});

const PageTitle = atomFamily<string, number>({
  key: RecoilKeys.CALCULATE_PAGE_TITLE,
  default: "Untitle",
  effects: (id) => [
    localStoragePersistenceEffect<string>(RecoilKeys.CALCULATE_PAGE_TITLE + id),
  ]
});

const PageIDNameMapSelector = selector({
  key: RecoilKeys.CALCULATE_PAGE_ID_NAME_MAP,
  get: ({ get }) => {
    const ids = get(PageId);
    return ids.map((id) => {
      return {
        pageID: id,
        name: get(PageTitle(id))
      }
    });
  }
});


