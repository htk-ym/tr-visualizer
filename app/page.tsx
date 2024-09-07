"use client"

import * as React from "react";
import { Sidebar } from "@/_features/_sidebar/Sidebar";
import { PageHeader } from "@/_features/_sidebar/PageHeader";
import CalculatorView from "_features/_calculator/CalculatorView";

export default function Home() {

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-auto bg-slate-50">
        <PageHeader />
        <main className="flex-grow">
          <div className="flex">
            <CalculatorView />
          </div>
        </main>
      </div>
    </div>
  );
}
