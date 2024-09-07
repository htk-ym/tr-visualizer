
import TRRowComponent from "@/_features/_calculator/TRRowComponent";
import { useCalculatorViewModel } from "./CalculatorViewModel";
import AddOutputRowModal from "./AddOutputRowModal";

export default function CalculatorView() {

  const vm = useCalculatorViewModel();

  return (
    <div className="container m-10 mx-auto my-auto bg-slate-50">

      {/* View Range Hour Select */}
      <div className="m-5 mb-10 flex">
        <label className="w-25 select-none self-center text-lg text-gray-800">表示時間帯</label>
        <select value={vm.state.viewRangeHourStartTime} onChange={(e) => vm.action.setViewRangeHourStartTime(e.target.value)} className="ml-5 select-none rounded-md bg-transparent text-lg text-gray-800 focus:outline-none">
          {vm.state.viewRangeHourStartTimeOptions.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <div className="ml-5 select-none">~</div>
        <select value={vm.state.viewRangeHourEndTime} onChange={(e) => vm.action.setViewRangeHourEndTime(e.target.value)} className="ml-5 select-none rounded-md bg-transparent text-lg text-gray-800 focus:outline-none">
          {vm.state.viewRangeHourEndTimeOptions.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* TR Rows */}
      <div>
        {vm.state.sortedRowIDs.map((id) => {
          return (
            <TRRowComponent key={id} itemId={id} />
          )
        })}
      </div>

      {/* Add Button */}
      <div className="my-3 flex justify-center">
        <button onClick={vm.action.addRow}>
          <svg className="group" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path className="fill-gray-400 group-hover:fill-gray-900" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </svg>
        </button>

        <span className="w-5" />

        <button onClick={vm.action.openCustomAddRowDialog} hidden={vm.state.sortedRowIDs.length < 2}>
          <svg className="group" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path className="fill-gray-400 group-hover:fill-gray-900" d="m14.1 9l.9.9L5.9 19H5v-.9zm3.6-6c-.2 0-.5.1-.7.3l-1.8 1.8l3.7 3.8L20.7 7c.4-.4.4-1 0-1.4l-2.3-2.3c-.2-.2-.5-.3-.7-.3m-3.6 3.2L3 17.2V21h3.8l11-11.1zM7 2v3h3v2H7v3H5V7H2V5h3V2z" />
          </svg>
        </button>
      </div>

      {/* Dialogs */}
      {vm.state.isCustomAddRowDialogOpen && (<AddOutputRowModal />)}

    </div >
  )
}