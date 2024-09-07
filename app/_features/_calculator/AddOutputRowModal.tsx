import { useAddOutputRowViewModel } from "./AddOuputRowModalViewModel";

export default function AddOutputRowModal() {

  const vm = useAddOutputRowViewModel();

  return (
    <div id="testD" className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white">

        {/* Dialog Main*/}
        <div className="grid h-96 w-96 grid-cols-2 grid-rows-5 gap-0">
          <div className="col-span-3">
            <div className="rounded-t-md bg-gray-200 p-3 text-lg font-semibold text-slate-600">時間帯計算</div>
          </div>
          <div className="row-start-2 mx-auto text-gray-800">operand1</div>
          <div className="row-start-2">
            <select value={vm.state.operand1} onChange={vm.action.onChangeOperand1} className="ml-5 bg-transparent text-sm text-gray-800 focus:outline-none">
              <option key="dummy" value="-1">---</option>
              {vm.state.inputTROperand1Options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="row-start-2"></div>
          <div className="row-start-3 mx-auto text-gray-800">operand2</div>
          <div className="row-start-3">
            <select value={vm.state.operand2} onChange={vm.action.onChangeOperand2} className="ml-5 bg-transparent text-sm text-gray-800 focus:outline-none">
              <option key="dummy" value="-1">---</option>
              {vm.state.inputTROperand2Options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="row-start-3"></div>
          <div className="row-start-4 mx-auto text-gray-800">operator</div>
          <div className="row-start-4">
            <select value={vm.state.operator} onChange={vm.action.onChangeOperator} className="ml-5 bg-transparent text-sm text-gray-800 focus:outline-none">
              {vm.state.opratorTypeOptions.map(option => (
                <option key={option.toString()} value={option.toString()}>
                  {option.toString()}
                </option>
              ))}
            </select>
          </div>
          <div className="row-start-4"></div>
          <div className="col-span-3 flex rounded-b-md bg-gray-200 ">
            <button onClick={() => vm.action.close()} className="w-25 mx-auto my-auto h-10 border-0 px-8  text-lg text-gray-500">
              キャンセル
            </button>
            <button disabled={(vm.state.operand1 === -1 || vm.state.operand2 === -1)} onClick={() => vm.action.add()}
              className={`${(vm.state.operand1 === -1 || vm.state.operand2 === -1) ? `bg-gray-500` : `bg-indigo-500 hover:bg-indigo-600`} w-25 mx-auto my-auto h-10 rounded-3xl border-0  px-8 text-lg  text-white focus:outline-none`}>
              追加
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}