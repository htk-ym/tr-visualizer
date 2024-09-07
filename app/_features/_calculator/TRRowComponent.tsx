import { useTRRowComponentViewModel } from "./TRRowComponentViewModel";

export default function TRRowComponent({ itemId }: { itemId: number }) {

  // vm
  const vm = useTRRowComponentViewModel(itemId);

  /// Grid Sub component
  const GridMap = () => {
    const stroke = "lightgray";

    const gridLines = [];
    /// top-line
    gridLines.push(
      <line key="top line" x1="0" y1="15" x2="100%" y2="15" stroke={stroke} strokeWidth="1.0" />
    );
    /// x-axis
    for (let i = 0; i <= vm.state.viewRangeHour; i += 1) {
      gridLines.push(
        <line key={i + "line"} x1={i * 60} y1="15" x2={i * 60} y2="100%" stroke={stroke} strokeWidth={(i === 0 || i === vm.state.viewRangeHour) ? 1.0 : 1.0} />
      );
      // Adding text labels at each grid line
      gridLines.push(
        <text key={i + " text"} x={i === 0 ? 10 : i === vm.state.viewRangeHour ? (i * 60 - 10) : (i * 60)} y="10" fill="gray" fontSize="12" textAnchor="middle" className="select-none">
          {vm.state.viewRangeHourStartTime + i}
        </text>
      );
    }

    /// bottom-line
    gridLines.push(
      <line key="bottom line" x1="0" y1="100%" x2="100%" y2="100%" stroke={stroke} strokeWidth="2.0" />
    );
    return <>{gridLines}</>;
  };

  return (
    <div className="flex px-5 py-1">

      {/* Row Title */}
      <div className="mr-3 flex w-32 flex-initial select-none flex-col items-center justify-center">
        <textarea value={vm.state.rowName} onChange={vm.action.handleRowNameChange} className="w-32 select-none resize-none text-wrap bg-transparent text-center text-lg focus:outline-none focus:ring-0" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} />
        <div className="select-none bg-transparent text-center text-xs focus:outline-none focus:ring-0">{vm.state.barRangeString}</div>
      </div>

      {/* TR Row Main */}
      <div className="flex-grow" ref={vm.state.gridRef}>
        <svg viewBox={"0 0 " + (vm.state.viewRangeHour * 60) + " 65"} onMouseMove={vm.action.handleMouseMove} onMouseUp={vm.action.handleDropBar} onMouseLeave={vm.action.handleDropBar}>

          {/* Grid */}
          <GridMap />

          {vm.state.trBarArray.map((bar, index) => {
            return (
              <g key={index}>
                <rect x={bar.origin} y="25" width={bar.width} height="30" rx="5" ry="5" fill={vm.state.rowColor} onMouseDown={(e => vm.action.handleDragBar(index, e.screenX))} style={{ cursor: "ew-resize" }} />
                <circle cx={bar.origin} cy="40" r="15" fillOpacity="0.0" onMouseDown={(e) => vm.action.handleDragBarLeft(index, e.screenX)} style={{ cursor: "col-resize" }} />
                <circle cx={bar.origin + bar.width} cy="40" r="15" fillOpacity="0.0" onMouseDown={(e) => vm.action.handleDragBarRight(index, e.screenX)} style={{ cursor: "col-resize" }} />
                <rect x={bar.width < 70 ? bar.origin + bar.width + 5 : bar.origin + (bar.width / 2) - 35} y="30" width="70" height="20" rx="5" ry="5" fill="gray" onMouseDown={(e => vm.action.handleDragBar(index, e.screenX))} style={{ cursor: "ew-resize" }} />
                <text x={bar.width < 70 ? bar.origin + bar.width + 14 : bar.origin + (bar.width / 2) - 29} y="41" width="50" height="20" textAnchor="center" dominantBaseline="central" fontSize="10" fill="white" alignmentBaseline="middle" className="select-none" onMouseDown={(e => vm.action.handleDragBar(index, e.screenX))} style={{ cursor: "ew-resize" }} >{bar.hhmm}</text>
              </g>
            )
          })}

        </svg>
      </div>

      {/* Delete Button */}
      <div className="m-2 flex items-end">
        <button onClick={vm.action.deleteRow}>
          <svg className="group" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path className="fill-gray-400 group-hover:fill-gray-900" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
          </svg>
        </button>
      </div>

    </div >
  );
}