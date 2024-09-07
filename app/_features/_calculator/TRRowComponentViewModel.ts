import { minutes2hhmm } from "@/_domain/TimeFormat";
import { useRef } from "react";
import { useViewRangeHourSelectors } from "@/_store/ViewRangeHourState";
import { useTRRowMutators, useTRRowSelectors, useTRRowIDsSelector } from "@/_store/TRRowsState";

type State = {
  gridRef: React.RefObject<HTMLDivElement>,
  viewRangeHour: number,
  viewRangeHourStartTime: number,
  rowName: string,
  rowColor: string,
  barRangeString: string,
  trBarArray: { origin: number, width: number, hhmm: string }[],
}

type Action = {
  handleRowNameChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  handleDragBar: (originX: number, barIndex: number) => void,
  handleDragBarRight: (originX: number, barIndex: number) => void,
  handleDragBarLeft: (originX: number, barIndex: number) => void,
  handleDropBar: () => void,
  handleMouseMove: (e: React.MouseEvent) => void,
  deleteRow: () => void
}

export const useTRRowComponentViewModel: ViewModelFunc<State, Action, [number]> = (itemID: number) => {

  // store
  const trRowIDsSelector = useTRRowIDsSelector();
  const viewRangeHourSelectors = useViewRangeHourSelectors();
  const trRowMutator = useTRRowMutators(itemID);
  const trRowSelector = useTRRowSelectors(itemID);

  // component state
  const gridRefState = useRef<HTMLDivElement>(null);

  // exposed states
  const gridRef = gridRefState;
  const viewRangeHour = viewRangeHourSelectors.viewRangeHour;
  const viewRangeHourStartTime = viewRangeHourSelectors.viewRangeHourStartTime;
  const rowName = trRowSelector.name;
  const rowColor = trRowSelector.color;
  const barRangeString = (() => {
    const barRangeString = [];
    const times = trRowSelector.timeRange;
    for (let i = 0; i < times.length; i += 2) {
      const sthhmm = minutes2hhmm(times[i]);
      const ethhmmm = minutes2hhmm(times[i + 1]);
      barRangeString.push(`(${sthhmm}~${ethhmmm})`);
    }
    return barRangeString.join("\n");
  })();
  const trBarArray = (() => {
    const times = trRowSelector.timeRange;
    const trBarArray = [];
    for (let i = 0; i < times.length; i += 2) {
      const origin = times[i] - (viewRangeHourStartTime * 60);
      const width = times[i + 1] - origin - (viewRangeHourStartTime * 60);
      const hhmm = minutes2hhmm(width) + " (" + width + ")";
      trBarArray.push({ origin, width, hhmm });
    }
    return trBarArray;
  })();

  // exposed acrions
  const handleRowNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => trRowMutator.changeName(e.target.value);

  const handleDragBar = (barIndex: number, originX: number) => {
    trRowMutator.draggingBar(true);
    trRowMutator.dragBarPoint(barIndex, originX);
  };

  const handleDragBarRight = (barIndex: number, originX: number) => {
    trRowMutator.draggingBarRight(true);
    trRowMutator.dragBarPoint(barIndex, originX);
  };

  const handleDragBarLeft = (barIndex: number, originX: number) => {
    trRowMutator.draggingBarLeft(true);
    trRowMutator.dragBarPoint(barIndex, originX);
  }

  const handleDropBar = () => {
    trRowMutator.draggingBar(false);
    trRowMutator.draggingBarRight(false);
    trRowMutator.draggingBarLeft(false);
    trRowMutator.dragBarPoint(0, 0);
  }

  const handleMouseMove = (e: React.MouseEvent) => {

    //出力行は編集させない
    const isOutputRow = trRowIDsSelector.outputLayerDefinitions
    .map( (outputLayerDefinition) => outputLayerDefinition.outputTRIndex)
    .includes(itemID)

    if(isOutputRow) return;

    // どのBarを状態を変更するか
    const updateStartTimeIndex = trRowSelector.draggingBarIndex * 2;
    const updateEndTimeIndex = trRowSelector.draggingBarIndex * 2 + 1;

    // 変更前のBarの情報(minute)
    const selectedBarOrigin = trRowSelector.timeRange[updateStartTimeIndex];
    const selectedBarWidth = trRowSelector.timeRange[updateEndTimeIndex] - selectedBarOrigin;

    const snapN = 10; // shift press to snap to grid N minutes XXX: Bug 10 Only

    /// Calculate the movement in minutes
    let px2minRatio = 1.0;
    if (gridRef.current) {
      const gridWidth = gridRef.current.getBoundingClientRect().width;
      px2minRatio = viewRangeHour * 60 / gridWidth;
    }

    // 前回の更新から何分動いたか
    const movementXsinceLastUpdate = Math.round((e.screenX - trRowSelector.draggingBarOriginX) * px2minRatio);
    // このイベントで何分動いたか
    const movementXThisEvent = Math.round((e.movementX) * px2minRatio);

    // If Shift key is pressed. Snap to grid
    if (e.shiftKey && Math.abs(movementXsinceLastUpdate) < snapN) return;
    if (e.shiftKey && trRowSelector.draggingBarRight) {
      const newWidth = Math.round((selectedBarWidth + movementXsinceLastUpdate) / snapN) * snapN;
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateEndTimeIndex] = newTimes[updateStartTimeIndex] + newWidth
      trRowMutator.changeTimeRange(newTimes);
      trRowMutator.initDraggingBarOriginX(e.screenX);
      return;
    }
    if (e.shiftKey && trRowSelector.draggingBarLeft) {
      const newWidth = Math.round((selectedBarWidth - movementXsinceLastUpdate) / snapN) * snapN;
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateStartTimeIndex] = newTimes[updateEndTimeIndex] - newWidth;
      trRowMutator.changeTimeRange(newTimes);
      trRowMutator.initDraggingBarOriginX(e.screenX);
      return;
    }
    if (e.shiftKey && trRowSelector.draggingBar) {
      const snapedMovementXsinceLastUpdate = Math.round((movementXsinceLastUpdate) / snapN) * snapN;
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateStartTimeIndex] = Math.round((newTimes[updateStartTimeIndex] + snapedMovementXsinceLastUpdate) / snapN) * snapN;
      newTimes[updateEndTimeIndex] = Math.round((newTimes[updateEndTimeIndex] + snapedMovementXsinceLastUpdate) / snapN) * snapN;
      trRowMutator.changeTimeRange(newTimes);
      trRowMutator.initDraggingBarOriginX(e.screenX);
      return;
    }
    /// If shift key is not pressed, then move the bar freely
    if (trRowSelector.draggingBarRight) {
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateEndTimeIndex] += movementXThisEvent;
      trRowMutator.changeTimeRange(newTimes);
    }
    if (trRowSelector.draggingBarLeft) {
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateStartTimeIndex] += movementXThisEvent;
      trRowMutator.changeTimeRange(newTimes);
    }
    if (trRowSelector.draggingBar) {
      const newTimes = trRowSelector.timeRange.slice();
      newTimes[updateStartTimeIndex] += movementXThisEvent;
      newTimes[updateEndTimeIndex] += movementXThisEvent;
      trRowMutator.changeTimeRange(newTimes);
      return;
    }
  }

  const deleteRow = () => trRowMutator.deleteRow();

  return {
    state: {
      gridRef,
      viewRangeHour,
      viewRangeHourStartTime,
      rowName,
      rowColor,
      barRangeString,
      trBarArray
    },
    action: {
      handleRowNameChange,
      handleDragBar,
      handleDragBarLeft,
      handleDragBarRight,
      handleDropBar,
      handleMouseMove,
      deleteRow
    }
  }
}