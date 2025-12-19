import React, { useRef, useState } from "react";
import Header from "../Header/Header";
// import Sidebar from "./Sidebar";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import SideBar from "./Sidebar";
import NewHeader from "../Header/NewHeader";

export default function Dashboard({ children }) {
  const [hide, setHide] = useState(false);

  return (
    <>
      {/* <Header hide={hide} set_hide={setHide} heading={"Urban Transport"} /> */}
      <NewHeader hide={hide} set_hide={setHide} heading={"Urban Transport"} />
      <div className="flex flex-1 flex-row h-[90vh]">
        <div className={`${hide ? "hidden" : "flex"} w-3/12`}>
          <SideBar />
        </div>
        {children}
      </div>
    </>
  );
}
