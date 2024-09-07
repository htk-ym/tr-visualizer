"use client"

import { RxHamburgerMenu } from "react-icons/rx";
import { usePageHeaderViewModel } from "./PageHeaderViewModel";

export const PageHeader = () => {

  const vm = usePageHeaderViewModel();

  return (
    <header className={"ml-2 flex h-8 items-center justify-start px-5 py-10 "}>
      <button
        className={"cursor-pointer"}
        onClick={() => vm.action.toggleSideBar()}
      >
        <RxHamburgerMenu size={24} />
      </button>

      <div className="flex w-full items-center justify-between">

        <input
          type="text"
          className="text-18 ml-10 bg-transparent text-slate-600 focus:outline-none focus:ring-0"
          value={vm.state.title}
          onChange={(e) => vm.action.changeTitle(e.target.value)}
        />

        <button
          className="mr-2 px-5 py-10"
          onClick={vm.action.deleteItem}>
          <svg className="group" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path className="fill-gray-400 group-hover:fill-gray-900" fill="currentColor" d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z">
            </path>
          </svg>
        </button>
      </div>
    </header>
  );
};