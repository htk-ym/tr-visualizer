/**
 * 計算機に表示する時間の範囲とその選択肢を管理する
 */
import { RecoilKeys } from "@/_type/RecoilKeys";
import { atomFamily, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { localStoragePersistenceEffect } from "./LocalStoragePersistenceEffect";
import { SelectedPageID } from "./PageState";

// ===  Mutator  ================================================================================
export const useViewRangeHourMutators = () => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const setViewRangeHourStartTime = useSetRecoilState(viewRangeHourStartTimeAtom(selectedPageID));
  const setViewRangeHourEndTime = useSetRecoilState(viewRangeHourEndTimeAtom(selectedPageID));

  return {

    setViewRangeHourStartTime: (value: number) => {
      setViewRangeHourStartTime(value);
    },

    setViewRangeHourEndTime: (value: number) => {
      setViewRangeHourEndTime(value);
    }
  }
}

// ===  Selector  ================================================================================
export const useViewRangeHourSelectors = () => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const viewRangeHourStartTime = useRecoilValue(viewRangeHourStartTimeAtom(selectedPageID));
  const viewRangeHourEndTime = useRecoilValue(viewRangeHourEndTimeAtom(selectedPageID));
  const viewRangeHour = useRecoilValue(viewRangeHourSelector);
  const viewRangeHourStartTimeOptions = useRecoilValue(viewRangeHourStartTimeOptionsSelector);
  const viewRangeHourEndTimeOptions = useRecoilValue(viewRangeHourEndTimeOptionsSelector);

  return {
    viewRangeHourStartTime: viewRangeHourStartTime,
    viewRangeHourEndTime: viewRangeHourEndTime,
    viewRangeHour: viewRangeHour,
    viewRangeHourStartTimeOptions: viewRangeHourStartTimeOptions,
    viewRangeHourEndTimeOptions: viewRangeHourEndTimeOptions,
  }
}

// ===  Recoil Atom / Selector  ================================================================================

// 表示範囲の開始時間
const viewRangeHourStartTimeAtom = atomFamily<number, number>({
  key: RecoilKeys.VIEW_RANGE_HOUR_START_TIME,
  default: 7,
  effects: (id) => [
    localStoragePersistenceEffect<number>(RecoilKeys.VIEW_RANGE_HOUR_START_TIME + id),
  ]
});

// 表示範囲の終了時間
const viewRangeHourEndTimeAtom = atomFamily<number, number>({
  key: RecoilKeys.VIEW_RANGE_HOUR_END_TIME,
  default: 20,
  effects: (id) => [
    localStoragePersistenceEffect<number>(RecoilKeys.VIEW_RANGE_HOUR_END_TIME + id),
  ]
});

// 表示範囲の時間
const viewRangeHourSelector = selector<number>({
  key: RecoilKeys.VIEW_RANGE_HOUR_SELECTOR,
  get: ({ get }) => {
    return get(viewRangeHourEndTimeAtom(get(SelectedPageID))) - get(viewRangeHourStartTimeAtom(get(SelectedPageID)));
  }
});

// 表示範囲の開始時間の選択肢
const viewRangeHourStartTimeOptionsSelector = selector<string[]>({
  key: RecoilKeys.VIEW_RANGE_HOUR_START_TIME_OPTIONS_SELECTOR,
  get: ({ get }) => {
    const endTime = get(viewRangeHourEndTimeAtom(get(SelectedPageID)));
    const timeOptions = Array.from({ length: endTime }, (_, i) => {
      return `${i}:00`;
    });
    return timeOptions;
  }
});

// 表示範囲の終了時間の選択肢 depend on (viewRangeHourStartTimeAtom)
const viewRangeHourEndTimeOptionsSelector = selector<string[]>({
  key: RecoilKeys.VIEW_RANGE_HOUR_END_TIME_OPTIONS_SELECTOR,
  get: ({ get }) => {
    const startTime = get(viewRangeHourStartTimeAtom(get(SelectedPageID)));
    const timeOptions = Array.from({ length: 24 - startTime }, (_, i) => {
      return `${i + 1 + startTime}:00`;
    });
    return timeOptions;
  }
});