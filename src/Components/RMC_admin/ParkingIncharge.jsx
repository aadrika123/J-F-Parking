import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import parkingStop from "../../assets/parking-stop.png";
import { Formik, Form, Field } from "formik";
import Parking_Incharge from "./Tables/Parking_Incharge";
import axios from "axios";

export default function ParkingIncharge() {
  const navigate = useNavigate();
  const [location, setLocation] = useState();
  const [locationId, setLocationID] = useState();

  const token = localStorage.getItem("token");
  const fetchLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/get-all-parking-area`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocation(response.data.data);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);
  return (
    <>
      <div className="flex flex-1 ">
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center mt-5 p-4">
            <div className="flex ml-4 ">
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="flex flex-row cursor-pointer"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3837_9887)">
                    <path
                      d="M10.6736 7.20512L4 13.9135L10.6736 20.6218C10.7339 20.7009 10.8105 20.7662 10.8981 20.8132C10.9858 20.8602 11.0826 20.8878 11.1819 20.8941C11.2812 20.9004 11.3806 20.8854 11.4736 20.8499C11.5666 20.8144 11.6508 20.7594 11.7206 20.6886C11.7905 20.6177 11.8443 20.5327 11.8784 20.4393C11.9125 20.3458 11.9262 20.2461 11.9184 20.147C11.9107 20.0478 11.8817 19.9514 11.8335 19.8644C11.7853 19.7774 11.7189 19.7018 11.6389 19.6426L6.64583 14.6079H19.9306C20.1147 14.6079 20.2914 14.5347 20.4216 14.4045C20.5518 14.2743 20.625 14.0976 20.625 13.9135C20.625 13.7293 20.5518 13.5526 20.4216 13.4224C20.2914 13.2922 20.1147 13.219 19.9306 13.219H6.64583L11.6389 8.18429C11.7687 8.05352 11.8413 7.87653 11.8407 7.69225C11.84 7.50797 11.7662 7.33149 11.6354 7.20165C11.5047 7.0718 11.3277 6.99922 11.1434 6.99987C10.9591 7.00052 10.7826 7.07435 10.6528 7.20512H10.6736Z"
                      fill="#665DD9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3837_9887">
                      <rect
                        width="25"
                        height="25"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 25)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="ml-2 mt-1 text-[#665DD9]  text-sm text-center">
                  {" "}
                  Back
                </div>
              </div>
            </div>
            <div className="flex text-xl font-semibold  mr-4">
              Parking In-Charge  
            </div>
          </div>

          

          <div className="flex flex-1 flex-col border-2 shadow-md rounded-md bg-white m-4">
            <div className="flex flex-1 justify-start items-start m-4">
              <div className="flex flex-col mt-5 w-full h-fit ">
                <Parking_Incharge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
