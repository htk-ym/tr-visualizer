import { useState } from "react";
;
import { useTRRowIDsMutator, useTRRowIDsSelector } from "@/_store/TRRowsState";
import { useViewStateMutators } from "@/_store/ViewState";

type State = {
  inputTROperand1Options: { id: number, name: string }[],
  inputTROperand2Options: { id: number, name: string }[],
  opratorTypeOptions: String[],
  operand1: number,
  operand2: number,
  operator: OperatorType
}

type Action = {
  close: () => void,
  add: () => void,
  onChangeOperand1: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onChangeOperand2: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onChangeOperator: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const useAddOutputRowViewModel: ViewModelFunc<State, Action> = () => {

  // store
  const trRowIDsSelector = useTRRowIDsSelector();
  const trRowIDsMutator = useTRRowIDsMutator();
  const viewStateMutators = useViewStateMutators();

  // component state
  const [operand1, setOpe1] = useState(-1);
  const [operand2, setOpe2] = useState(-1);
  const [operator, setOperator] = useState<OperatorType>("or");

  // exposed state
  const inputTROperand1Options = trRowIDsSelector.idNameMap.filter((item) => item.id !== operand2);
  const inputTROperand2Options = trRowIDsSelector.idNameMap.filter((item) => item.id !== operand1);
  const opratorTypeOptions = ["and", "or", "sub"]; // global.d.tsと2重管理なので注意 Union to Tapleは難しいらしい

  // action
  const close = () => viewStateMutators.closeAddCustomRowDialog();

  const add = () => {
    const newId = Date.now();

    const newState = {
      operandTR1Index: operand1,
      operandTR2Index: operand2,
      operator: operator,
      outputTRIndex: newId
    }
    trRowIDsMutator.addOutputRow(newId, newState);
    viewStateMutators.closeAddCustomRowDialog();
  }

  const onChangeOperand1 = (e: React.ChangeEvent<HTMLSelectElement>) => setOpe1(parseInt(e.target.value, 0));
  const onChangeOperand2 = (e: React.ChangeEvent<HTMLSelectElement>) => setOpe2(parseInt(e.target.value, 0));
  const onChangeOperator = (e: React.ChangeEvent<HTMLSelectElement>) => setOperator(e.target.value as OperatorType);

  return {
    state: {
      inputTROperand1Options,
      inputTROperand2Options,
      opratorTypeOptions,
      operand1,
      operand2,
      operator
    },
    action: {
      close,
      add,
      onChangeOperand1,
      onChangeOperand2,
      onChangeOperator
    }
  }
};
