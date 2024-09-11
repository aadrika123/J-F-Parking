// AppRoutes.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login_main from "../Components/Login/Login_main";
import PrivateRoute from "./PrivateRoute";
import ProtectedApproute from "./ProtectedApproute";
import RMC_Dashboard from "../Components/RMC_admin/RMC_Dashboard";
import ParkingArea from "../Components/RMC_admin/ParkingArea";
import ParkingIncharge from "../Components/RMC_admin/ParkingIncharge";
import ParkingReport from "../Components/RMC_admin/ParkingReport";
import ParkingArea_onboarding from "../Components/RMC_admin/Registration/ParkingArea_onboarding";
import ParkingSchedule from "../Components/RMC_admin/ParkingSchedule";
import ParkingIncharge_onboarding from "../Components/RMC_admin/Registration/ParkingIncharge_onboarding";
import Parking_Scheduling from "../Components/RMC_admin/Schedule/Parking_Scheduling";
import Incharge_Dashboard from "../Components/Ticket_checker/Incharge_Dashboard";
import Ticket_check from "../Components/Ticket_checker/Ticket_check";
import Report_generation_checker from "../Components/Ticket_checker/Report/Report_generation_checker";
import Report_page from "../Components/Ticket_checker/Report/Report_page";
import AccountantViewPage from "../Components/RMC_admin/Accountant";
import AccountView from "../Components/RMC_admin/AccountView";

const AppRoutes = ({ access_token, userType }) => {
  console.log("AppRoutes with token >>> ", access_token, userType);

  return (
    <Routes>
      <Route path="/" element={<Login_main />} />
      {access_token && userType === "Admin" && (
        <>
          <Route
            path="/dashboard"
            element={<PrivateRoute Element={RMC_Dashboard} />}
          />
          <Route
            path="/parkingArea"
            element={<PrivateRoute Element={ParkingArea} />}
          />
          <Route
            path="/parkingincharge"
            element={<PrivateRoute Element={ParkingIncharge} />}
          />
          <Route
            path="/parkingReport"
            element={<PrivateRoute Element={ParkingReport} />}
          />
          <Route
            path="/OnboardingParkingArea"
            element={<PrivateRoute Element={ParkingArea_onboarding} />}
          />
          <Route
            path="/ParkingScheduling"
            element={<PrivateRoute Element={ParkingSchedule} />}
          />
          <Route
            path="/OnboardingParkingIncharge"
            element={<PrivateRoute Element={ParkingIncharge_onboarding} />}
          />
          <Route
            path="/Scheduling"
            element={<PrivateRoute Element={Parking_Scheduling} />}
          />
          {/* <Route
            path="/accountant"
            element={<PrivateRoute Element={AccountantViewPage} />}
          /> */}
          <Route
            path="/account-view"
            element={<PrivateRoute Element={AccountView} />}
          />
        </>
      )}
      {access_token && userType === "Employee" && (
        <>
          <Route
            path="/In_Charge"
            element={<ProtectedApproute element={Incharge_Dashboard} />}
          />
          <Route
            path="/ticket_check"
            element={<ProtectedApproute element={Ticket_check} />}
          />
          <Route
            path="/checker_report"
            element={<ProtectedApproute element={Report_generation_checker} />}
          />
          <Route
            path="/Incharge_Report"
            element={<ProtectedApproute element={Report_page} />}
          />
        </>
      )}
      {access_token && userType === "Accountant" && (
        <>
          <Route
            path="/accountant"
            element={<PrivateRoute Element={AccountantViewPage} />}
          />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
