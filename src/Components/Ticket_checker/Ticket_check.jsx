import React from "react";
import { useLocation } from "react-router-dom";

import Organised_ticket_check from "./Organised_ticket_check";
import Unorganised_ticket_check from "./Unorganised_ticket_check";
export default function Ticket_check() {
  const location = useLocation();
  console.log(location.state);
  const Ticket_type = location.state.parkingAreaType;

  if (Ticket_type === "UnOrganized") {
    return (
      <Unorganised_ticket_check
        type_parking_space={location.state.parkingAreaType}
        area_id={location.state.parkingId}
      />
    );
  } else if (Ticket_type === "Organized") {
    return (
      <Organised_ticket_check
        type_parking_space={location.state.parkingAreaType}
        area_id={location.state.parkingId}
      />
    );
  } else {
    return (
      <div className="flex flex-1 justify-center items-center h-screen bg-red-400">
        Parking Area Type is not defined Please contact Admin
      </div>
    );
  }
}
