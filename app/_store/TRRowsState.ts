/**
 * 時間帯1行分の状態管理(ID指定)
 */

import TimeRange from "@/_domain/TimeRange";
import { RecoilKeys } from "@/_type/RecoilKeys";
import { atom, atomFamily, selector, selectorFamily, useRecoilValue, useSetRecoilState } from "recoil";
import { localStoragePersistenceEffect } from "./LocalStoragePersistenceEffect";
import { SelectedPageID } from "./PageState";

// ===  Mutator  ================================================================================
export const useTRRowIDsMutator = () => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const setRowIds = useSetRecoilState(rowIDsAtom(selectedPageID));
  const setOutputLayerDefinition = useSetRecoilState(outputLayerDefinitionSelector);

  return {
    addRow: () => setRowIds((prevState) => [...prevState, Date.now()]),
    addOutputRow: (newId: number, newState: { operandTR1Index: number, operandTR2Index: number, operator: OperatorType, outputTRIndex: number }) => {
      setRowIds((prevState) => [...prevState, newId]);
      setOutputLayerDefinition((prevState) => [...prevState, newState]);
    },
  }
}

export const useTRRowMutators = (rowID: number) => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const setRowIds = useSetRecoilState(rowIDsAtom(selectedPageID));
  const setRowName = useSetRecoilState(rowNameSelector(rowID));
  const setRowTimeRange = useSetRecoilState(rowTimeRangeSelector(rowID));

  const setDraggingBar = useSetRecoilState(draggingBarAtomFamily(rowID));
  const setDraggingBarIndex = useSetRecoilState(draggingBarIndexAtomFamily(rowID));
  const setDraggingBarRight = useSetRecoilState(draggingBarRightAtomFamily(rowID));
  const setDraggingBarLeft = useSetRecoilState(draggingBarLeftAtomFamily(rowID));
  const setDraggingBarOriginX = useSetRecoilState(draggingBarOriginXAtomFamily(rowID));

  return {
    deleteRow: () => setRowIds((prevState) => prevState.slice().filter(id => id !== rowID)),
    changeName: (name: string) => setRowName(name),

    changeTimeRange: (timeRange: number[]) => setRowTimeRange(timeRange),

    draggingBar: (value: boolean) => setDraggingBar(value),
    draggingBarRight: (value: boolean) => setDraggingBarRight(value),
    draggingBarLeft: (value: boolean) => setDraggingBarLeft(value),
    dragBarPoint: (barIndex: number, originX: number) => {
      setDraggingBarIndex(barIndex);
      setDraggingBarOriginX(originX);
    },
    initDraggingBarOriginX: (point: number) => setDraggingBarOriginX(point),

  }
};

// ===  Selector  ================================================================================
export const useTRRowIDsSelector = () => {
  const selectedPageID = useRecoilValue(SelectedPageID);

  const ids = useRecoilValue(rowIDsAtom(selectedPageID));
  const idNameMap = useRecoilValue(rowIDNameSelector);
  const outputLayerDefinitions = useRecoilValue(outputLayerDefinitionAtom);

  return {
    ids: ids,
    idNameMap: idNameMap,
    outputLayerDefinitions: outputLayerDefinitions,
  }
}

export const useTRRowSelectors = (rowID: number) => {

  const rowTimeRange = useRecoilValue(rowTimeRangeSelector(rowID));
  const rowName = useRecoilValue(rowNameSelector(rowID));
  const rowColor = useRecoilValue(rowColorSelector(rowID));

  const draggingBarIndex = useRecoilValue(draggingBarIndexAtomFamily(rowID));
  const draggingBar = useRecoilValue(draggingBarAtomFamily(rowID));
  const draggingBarRight = useRecoilValue(draggingBarRightAtomFamily(rowID));
  const draggingBarLeft = useRecoilValue(draggingBarLeftAtomFamily(rowID));
  const draggingBarOriginX = useRecoilValue(draggingBarOriginXAtomFamily(rowID));

  return {
    timeRange: rowTimeRange,
    name: rowName,
    color: rowColor,
    draggingBarIndex: draggingBarIndex,
    draggingBar: draggingBar,
    draggingBarRight: draggingBarRight,
    draggingBarLeft: draggingBarLeft,
    draggingBarOriginX: draggingBarOriginX,
  }
};

// ===  Recoil Atom / Selector  ================================================================================

// TR行のID atomFamilyのIndex
const rowIDsAtom = atomFamily<number[], number>({
  key: RecoilKeys.ROWS_IDS,
  default: [],
  effects: (id) => [
    localStoragePersistenceEffect<number[]>(RecoilKeys.ROWS_IDS + id, [Date.now()]),
  ]
});

// TR行の時間帯([1つ目の時間帯の開始時刻, 1つ目の時間帯の終了時刻, 2つ目の時間帯の開始時刻, 2つ目の時間帯の終了時刻, ...])
const rowTimeRangeAtomFamily = atomFamily<number[], number>({
  key: RecoilKeys.ROW_TIME_RANGE_ATOM_FAMILY,
  default: [540, 720],
  effects: (id) => [
    localStoragePersistenceEffect<number[]>(RecoilKeys.ROW_TIME_RANGE_ATOM_FAMILY + id),
  ]
});
const rowTimeRangeSelector = selectorFamily<number[], number>({
  key: RecoilKeys.ROW_TIME_RANGE_SELECTOR,
  get: (itemID: number) => ({ get }) => get(rowTimeRangeAtomFamily(itemID)),
  set: (itemID: number) => ({ set, get }, newValue) => {
    const def = get(outputLayerDefinitionAtom);
    
    const updateRowTimeRangeRecursive = (dependencyItemID: number, newV: number[]) => {
      for (let i = 0; i < def.length; i++) {
        const formula = def[i];
        if (dependencyItemID === formula.operandTR1Index || dependencyItemID === formula.operandTR2Index) {
          const operand1 = dependencyItemID === formula.operandTR1Index ? newV : get(rowTimeRangeAtomFamily(formula.operandTR1Index));
          const operand2 = dependencyItemID === formula.operandTR2Index ? newV : get(rowTimeRangeAtomFamily(formula.operandTR2Index));

          let nextV: number[] = [];
          nextV = TimeRange.calculate(formula.operator, operand1, operand2);
          set(rowTimeRangeAtomFamily(formula.outputTRIndex), nextV);
          updateRowTimeRangeRecursive(formula.outputTRIndex, nextV);
        }
      }
      return;
    }
    updateRowTimeRangeRecursive(itemID, newValue as number[]);

    set(rowTimeRangeAtomFamily(itemID), newValue);
  }
});

// 出力層の計算定義
const outputLayerDefinitionAtom = atom<{
  operandTR1Index: number,
  operandTR2Index: number,
  operator: OperatorType,
  outputTRIndex: number
}[]>({
  key: RecoilKeys.OUTPUT_LAYER_DEFINITION_ATOM,
  default: [],
  effects: [
    localStoragePersistenceEffect<{
      operandTR1Index: number,
      operandTR2Index: number,
      operator: OperatorType,
      outputTRIndex: number
    }[]>(RecoilKeys.OUTPUT_LAYER_DEFINITION_ATOM),
  ]
});
const outputLayerDefinitionSelector = selector<{
  operandTR1Index: number,
  operandTR2Index: number,
  operator: OperatorType,
  outputTRIndex: number
}[]>({
  key: RecoilKeys.OUTPUT_LAYER_DEFINITION_SELECTOR,
  get: ({ get }) => {
    return get(outputLayerDefinitionAtom);
  },
  set: ({ set, get }, newValue) => {
    set(outputLayerDefinitionAtom, newValue);

    const newV = newValue as { operandTR1Index: number, operandTR2Index: number, operator: OperatorType, outputTRIndex: number }[];
    const formula = newV[newV.length - 1];
    const operand1 = get(rowTimeRangeAtomFamily(formula.operandTR1Index));
    const operand2 = get(rowTimeRangeAtomFamily(formula.operandTR2Index));
    set(rowTimeRangeAtomFamily(formula.outputTRIndex), TimeRange.calculate(formula.operator, operand1, operand2));
  }
});

// TR行の名前
const rowNameAtomFamily = atomFamily<string, number>({
  key: RecoilKeys.ROW_NAME_ATOM_FAMILY,
  default: () => `Untitle`,
  effects: (id) => [
    localStoragePersistenceEffect<string>(RecoilKeys.ROW_NAME_ATOM_FAMILY + id),
  ]
});
const rowNameSelector = selectorFamily<string, number>({
  key: RecoilKeys.ROW_NAME_SELECTOR,
  get: (itemID: number) => ({ get }) => get(rowNameAtomFamily(itemID)),
  set: (itemID: number) => ({ set }, newValue) => set(rowNameAtomFamily(itemID), newValue)
});

// TR行の名前とID XXX
const rowIDNameSelector = selector<{ id: number, name: string }[]>({
  key: RecoilKeys.ROW_ID_NAME_SELECTOR,
  get: ({ get }) => {
    const rowIDs = get(rowIDsAtom(get(SelectedPageID)));
    return rowIDs.map((id) => {
      return {
        id: id,
        name: get(rowNameSelector(id)),
      }
    });
  }
});

// TR行の色
const rowColorAtomFamily = atomFamily<string, number>({
  key: RecoilKeys.ROW_COLOR_ATOM_FAMILY,
  default: "#7fbfff",
  effects: (id) => [
    localStoragePersistenceEffect<string>(RecoilKeys.ROW_COLOR_ATOM_FAMILY + id),
  ]
});
const rowColorSelector = selectorFamily<string, number>({
  key: RecoilKeys.ROW_COLOR_SELECTOR,
  get: (itemID: number) => ({ get }) => {

    const def = get(outputLayerDefinitionAtom);
    for (let index = 0; index < def.length; index++) {
      const formula = def[index];
      if (formula.outputTRIndex === itemID) {
        switch (formula.operator) {
          case "or":
            return "#ff8ec6";

          case "and":
            return "#93ff93";

          case "sub":
            return "#c993ff";

          default:
            return "#7fbfff";
        }
      }
    }

    return get(rowColorAtomFamily(itemID));
  },
  set: (itemID: number) => ({ set }, newValue) => {
    set(rowColorAtomFamily(itemID), newValue);
  }
});

// ドラッグされているTR行のIndex
const draggingBarIndexAtomFamily = atomFamily<number, number>({
  key: RecoilKeys.DRAGGING_BAR_INDEX_ATOM_FAMILY,
  default: 0,
});

// TR行の時間帯バーがドラッグされている？
const draggingBarAtomFamily = atomFamily<boolean, number>({
  key: RecoilKeys.DRAGGING_BAR_ATOM_FAMILY,
  default: false,
});

// TR行の時間帯バーの右端をドラッグされている？
const draggingBarRightAtomFamily = atomFamily<boolean, number>({
  key: RecoilKeys.DRAGGING_BAR_RIGHT_ATOM_FAMILY,
  default: false,
});

// TR行の時間帯バーの左端をドラッグされている？
const draggingBarLeftAtomFamily = atomFamily<boolean, number>({
  key: RecoilKeys.DRAGGING_BAR_LEFT_ATOM_FAMILY,
  default: false,
});

// TR行の時間帯バーがドラッグされた最初の地点のX座標
const draggingBarOriginXAtomFamily = atomFamily<number, number>({
  key: RecoilKeys.DRAGGING_BAR_ORIGINX_ATOM_FAMILY,
  default: 0,
});
