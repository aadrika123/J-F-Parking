import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RMC_logo from "../../../assets/RMC_LOGO.png";
import bus from "../../../assets/icons/Parking/Images/bus.png";
import background_image from "../../../assets/background_image.png";
import two_wheeler from "../../../assets/two 1.jpg";
import four_wheeler from "../../../assets/car 1.jpg";

export default function Report_page() {
  const navigate = useNavigate();
  const location = useLocation();
  const report_data = location.state;

  return (
    <div className="flex items-center justify-between h-screen w-screen">
      <div className="flex flex-1 flex-col justify-between bg-white h-screen ">
        <div
          onClick={() => navigate(-1)}
          className="absolute w-fit h-fit top-4 left-4 md:hidden"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M54 15.1515L45.8098 8L0 48L45.8098 88L54 80.8485L16.3805 48L54 15.1515Z"
              fill="#414141"
            />
          </svg>
        </div>
        <div className="flex h-[250px] md:h-[100px] pb-8 justify-center items-center md:justify-start rounded-b-[30px] border-b-[3px] border-l-0 border-r-0 shadow-md border-t-0">
          <div className="flex flex-1 flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row">
                <div className="flex mt-8 justify-center items-center">
                  <img
                    src={RMC_logo}
                    alt="RMC Logo"
                    className="flex max-w-full mt-5 ml-5 mr-5 h-auto md:h-1/2"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex mt-5 ">
                    <h2
                      style={{ fontWeight: 500, fontSize: 20 }}
                      className="text-[#585858]"
                    >
                      Ranchi Municipal Corporation
                    </h2>
                  </div>
                  <div className="flex mt-2 flex-row ">
                    <h1 className="text-md font-bold break-words text-[#1436C3]">
                      Parking Management System
                    </h1>
                    <img
                      src={bus}
                      alt="Bus"
                      className="ml-2 max-w-full h-full md:h-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 mt-5 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-around w-full px-10 gap-4">
              <div className="flex flex-col justify-center items-center bg-white p-2 border-2 border-blue-400 rounded-md shadow-md">
                <img src={two_wheeler} alt="Two Wheeler" />
                <h2 className="text-md text-blue-400 font-bold">Two Wheeler</h2>
                <div className="flex flex-col flex-1 justify-center items-center mt-2">
                  <p>Total Collection</p>
                  <p className="text-lg text-green-800 font-bold">
                    Rs. {report_data?.total_two_wheeler_collection}/-
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center bg-white p-2 border-2 border-blue-400 rounded-md shadow-md">
                <img src={four_wheeler} alt="Two Wheeler" />
                <h2 className="text-md text-blue-400 font-bold">
                  Four Wheeler
                </h2>
                <div className="flex flex-col flex-1 justify-center items-center mt-2">
                  <p>Total Collection</p>
                  <p className="text-lg text-green-800 font-bold">
                    Rs. {report_data?.total_four_wheeler_collection}/-
                  </p>
                </div>
              </div>

              {/* <div className="flex flex-col justify-center items-center bg-gray-200 p-5 rounded-md shadow-md">
                <h2 className="text-xl font-bold">Four-Wheeler Collection</h2>
                <p className="text-lg">
                  {report_data.total_four_wheeler_collection}
                </p>
                </div>
              */}
            </div>
            <div className="flex flex-col justify-center items-center bg-white p-4 rounded-md shadow-md mt-8">
              <h2 className="text-xl text-blue-400 font-bold">Total Amount</h2>
              <p className="text-lg text-green-800 font-bold">
                Rs. {report_data?.total_amount} /-
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full h-fit justify-center ">
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="flex mt-10 mb-5 w-fit justify-center items-center bg-white">
                <img
                  src={background_image}
                  className="flex flex-1 max-w-full h-auto md:w-fit md:h-[50vh] object-cover"
                  alt="Background"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
