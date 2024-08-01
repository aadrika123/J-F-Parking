import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { TurnLeftOutlined } from "@mui/icons-material";

export default function RMC_Dashboard() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [val, setVal] = useState([]);
  const [series, setSeries] = useState([]);
  const [axis, setXaxis] = useState([]);
  const [pie, setPie] = useState({ UnOrganized: [], Organized: [] });
  const [count, setCount] = useState({ two_wheeler: [], four_wheeler: [] });

  const [fromDates, setFromDates] = useState(new Date());
  const [toDates, setToDates] = useState(new Date());
  const [counts, setCounts] = useState({ two_wheeler: [], four_wheeler: [] });

  const [nfromDates, setNFromDates] = useState(new Date());
  const [ntoDates, setNToDates] = useState(new Date());

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const newDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    newDate
  );

  const cookie = Cookies.get("accesstoken");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const dates = count.two_wheeler
    ?.concat(count?.four_wheeler)
    ?.map((item) => formatDate(item.date));

  const uniqueDates = [...new Set(dates)];

  const formatDates = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const datess = count.two_wheeler
    ?.concat(counts?.four_wheeler)
    ?.map((item) => formatDates(item.date));

  const uniqueDatess = [...new Set(datess)];

  ////////////////////// api call /////////////////////////////////////////////////////////////////////////////////////

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/report/real-time`,
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      const responseData = response.data.data;
      setVal(responseData);

      const seriesData = responseData?.data?.map((item) => item.sum);
      setSeries(seriesData);

      const x = responseData?.data?.map((item) => item.to);
      setXaxis(x);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /////////////////////////////////////////////////////////////////////////

  const formatDat = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchDatas = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/weekly-collection`,
        {
          from_date: formatDat(nfromDates),
          to_date: formatDat(ntoDates),
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setPie(response.data.data);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [nfromDates, ntoDates]);

  /////////////////////////////////////////////////////////////////////////

  const fetchCount = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/vehicle-count`,
        {
          from_date,
          to_date,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setCount(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the vehicle count!", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      const from_date = fromDate.toISOString().split("T")[0];
      const to_date = toDate.toISOString().split("T")[0];
      fetchCount(from_date, to_date);
    }
  }, [fromDate, toDate]);


  useEffect(() => {
    if (fromDates && toDates) {
      const from_date = fromDates.toISOString().split("T")[0];
      const to_date = toDates.toISOString().split("T")[0];
      fetchCounts(from_date, to_date);
    }
  }, [fromDates, toDates]);
  //////////////////////////////////////////////////

  const fetchCounts = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/vehicle-count`,
        {
          from_date,
          to_date,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setCounts(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the vehicle count!", error);
    }
  };



  ////////////////////// api call ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////// bar element data /////////////////////////////////////////////////////////

  const sum = series?.reduce((acc, current) => acc + current, 0);
  const unOrgTotal = count?.two_wheeler?.reduce(
    (total, item) => total + item?.total_amount,
    0
  );
  const orgTotal = count?.four_wheeler?.reduce(
    (total, item) => total + item?.total_amount,
    0
  );
 

  const data = {
    series: [
      {
        name: "Real Time Collection",
        data: series,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        colors: ["#4A3AFF"],
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: axis,
      },
    },
  };

  const donutData = {
    series: [unOrgTotal, orgTotal],
    options: {
      chart: {
        type: "donut",
      },
      colors: ["#4A3AFF", "#C893FD"],

      plotOptions: {
        donut: {
          expandOnClick: false,
        },
      },
      labels: ["Two Wheeler Collection", "Four Wheeler Collection"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    },
  };

  const bar = {
    series: [
      {
        name: "Two Wheeler",
        data: counts?.two_wheeler?.map((item) => item?.vehicle_count),
      },
      {
        name: "Four Wheeler",
        data: counts?.four_wheeler?.map((item) => item?.vehicle_count),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#4A3AFF", "#C893FD"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: uniqueDatess,
      },
    },
  };

  console.log(
    "Data >> ",
    pie?.UnOrganized?.map((item) => item?.total_amount).length
  );
  const bar2 = {
    series: [
      {
        name: "UnOrganized",
        data:
          pie?.UnOrganized?.map((item) => item?.total_amount).length === 0
            ? [0]
            : pie?.UnOrganized?.map((item) => item?.total_amount),
      },
      {
        name: "Organized",
        data:
          pie?.Organized?.map((item) => item?.total_amount).length === 0
            ? [0]
            : pie?.Organized?.map((item) => item?.total_amount),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#4A3AFF", "#C893FD"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: uniqueDates,
      },
    },
  };

  ///////////////////////////////////////////////////// bar element data //////////////////////////////////////////////////

  return (
    <>
      <div className="flex flex-1 overflow-y-scroll overflow-x-scroll ">
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center mt-5 p-5">
            
            <div className="flex text-xl font-semibold  mr-4">
              Parking Report
            </div>
          </div>

          <div className="flex flex-col overflow-y-scroll">
            <div className="flex flex-1 justify-center items-center">
              {/* col-1 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center rounded-md shadow-xl border-2  bg-white m-2">
                <div className="flex flex-row w-full h-fit justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Real-time Collection
                    </div>
                  </div>

                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2  text-gray-400 ml-[-2rem]" />
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={data.options}
                        series={data.series}
                        type="line"
                        height="300"
                        width="470"
                      />
                    </div>
                    <div className="flex-col mt-[9rem] p-2 justify-center items-center">
                      <p className="text-xl ">
                        ₹{" "}
                        <span className="font-bold text-green-500">{sum}</span>
                      </p>
                      <p className="text-sm ">
                        Total No. of Current<br></br> Collection
                      </p>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>

              {/* col-2 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">Weekly Collection</div>
                  </div>
                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            onChange={(date) => setFromDate(date)}
                            selectsStart
                            selected={fromDate}
                            startDate={fromDate}
                            endDate={toDate}

                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                             selected={toDate}
                            onChange={(date) => setToDate(date)}
                            selectsEnd
                            startDate={fromDate}
                            endDate={toDate}
                            minDate={fromDate}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={donutData.options}
                        series={donutData.series}
                        type="donut"
                        height="300"
                        width="350"
                      />
                    </div>

                    <div className="flex gap-2 grid-cols-2 mt-[9rem]  justify-center items-center">
                      <div className="flex flex-1 flex-col">
                        <p className="text-xl">
                          ₹{" "}
                          <span className="font-bold text-green-500">
                            {unOrgTotal}
                          </span>
                        </p>
                        <p className="text-sm ">
                          Total Two Wheeler<br></br> Collection
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <p className="text-xl ">
                          ₹{" "}
                          <span className="font-bold text-green-500">
                            {orgTotal}
                          </span>
                        </p>
                        <p className="text-sm">
                          Total Four Wheeler<br></br> Collection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
              {/* col-1 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Weekly Vehicle Count
                    </div>
                  </div>
                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            selected={fromDates}
                            onChange={(date) => setFromDates(date)}
                            selectsStart
                            startDate={fromDates}
                            endDate={toDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                            selected={toDates}
                            onChange={(date) => setToDates(date)}
                            selectsEnd
                            startDate={fromDates}
                            endDate={toDates}
                            minDate={fromDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center mt-3">
                    <div>
                      <Chart
                        options={bar.options}
                        series={bar.series}
                        type="bar"
                        height="300"
                        width="600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* col-2 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Weekly Vehicle Collection
                    </div>
                  </div>

                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            onChange={(date) => setNFromDates(date)}
                            selectsStart
                            
                            selected={nfromDates}
                            startDate={nfromDates}
                            endDate={ntoDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                            selected={ntoDates}
                            onChange={(date) => setNToDates(date)}
                            selectsEnd
                          
                            startDate={nfromDates}
                            endDate={ntoDates}
                            minDate={nfromDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full mt-3">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={bar2.options}
                        series={bar2.series}
                        type="bar"
                        height="300"
                        width="600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
