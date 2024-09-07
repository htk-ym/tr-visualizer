"use client"

import { useSidebarViewModel } from "./SidebarViewModel";

export const Sidebar = () => {

  const vm = useSidebarViewModel();

  return (
    <nav className={`${vm.state.isSidebarOpen ? "w-48 p-3" : "w-0"}  overflow-auto bg-gray-900 duration-300`} >

      {vm.state.pageIdNameTaple.map((item, id) => {
        return (
          <button
            key={id}
            className={`${item.pageID == vm.state.selectedPageID
              ? "bg-blue-500 shadow-lg shadow-blue-500/50"
              : ""
              } text-14 my-2 flex min-h-12 w-full items-center rounded-lg px-2 py-3 text-white duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50`}
            onClick={() => vm.action.onClickItem(item.pageID)}
          >
            <p className={"mx-5 grow"}>{item.name}</p>
          </button>
        )
      })}

      {/* Add Button */}
      <div className="my-3 flex justify-center">
        <button onClick={vm.action.onClickAddButton}>
          <svg className="group" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path className="fill-gray-400 group-hover:fill-gray-100" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};