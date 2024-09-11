// AccountantViewPage.jsx
import { useState, useContext, useEffect, useRef } from "react";
import TitleBar from "../Header/TitleBar";
import { FaChartPie } from "react-icons/fa";
import { contextVar } from "../context/contextVar";
import { FaArrowRightLong } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import list from "@/Components/assets/list.svg"; // Adjust path if necessary
import { useLocation, useNavigate } from "react-router-dom";
import allData from "./dataService";
import { CSVLink } from "react-csv"; // For CSV export
import { usePDF } from "react-to-pdf"; // For PDF export
const AccountantViewPage = () => {
  const { titleBarVisibility } = useContext(contextVar);
  const [activeTab, setActiveTab] = useState("Submited Cash");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalResults, setTotalResults] = useState(allData[activeTab].length);
  const [filteredData, setFilteredData] = useState(allData[activeTab]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [conductorId, setConductorId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredData(allData[activeTab]);
    setTotalResults(allData[activeTab].length);
  }, [activeTab]);

  const boqListingFunc = () => {
    if (!startDate || !endDate || !conductorId) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter data based on date range
    const filtered =
      allData[activeTab]?.filter((data) => {
        const itemDate = new Date(data.date);
        return (
          itemDate >= start &&
          itemDate <= end &&
          data.id.toString().includes(conductorId)
        );
      }) || [];

    setFilteredData(filtered);
    setTotalResults(filtered.length);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleViewClick = () => {
    navigate("/account-view");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const handlePageChange = (event) => {
    const { value } = event.target;
    if (value > 0 && value <= totalPages) {
      setCurrentPage(Number(value));
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page after changing items per page
  };

  const headers = [
    { label: "S.No", key: "sno" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Amount", key: "amount" },
    { label: "Payee", key: "payee" },
    { label: "Conductor Id", key: "id" },

    { label: "Description", key: "description" },

    { label: "Action", key: "action" },
  ];

  const csvData = currentItems.map((data, index) => ({
    sno: index + 1,
    date: data.date,
    time: data.time,
    amount: data.amount,
    payee: data.payee,
    description: data.description,
  }));

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div>
      <div className="p-7">
        <TitleBar
          titleBarVisibility={titleBarVisibility}
          titleText={"Conductor Details"}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4 px-3">
          {["Submited Cash", "Disputed List", "Suspense Account"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-white bg-[#4338CA]"
                  : "text-gray-500"
              } focus:outline-none flex border border-[#4338ca] rounded`}
              onClick={() => {
                setActiveTab(tab);
                setFilteredData(allData[tab]);
                setTotalResults(allData[tab].length);
                setCurrentPage(1); // Reset to first page when tab changes
              }}
            >
              <FaChartPie className="m-1 text-[1rem]" />
              {tab}
            </button>
          ))}
        </div>

        <div className="flex justify-end mr-4">
          <button className="text-red bg-[#4338CA] hover:before:bg-redborder-red-500 relative overflow-hidden border px-7 py-2 text-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4338CA] before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full rounded-md">
            <span className="relative z-10 flex">
              Download schedule{" "}
              <FaArrowRightLong color="white" size={15} className="mt-1 ml-3" />
            </span>
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl bg-slate-100 m-3 cursor-pointer hover:border hover:border-blue-500 flex justify-between">
        <div className="flex m-4 justify-start">
          <div className="form-group flex-shrink max-w-full px-4 mb-4">
            <label className="inline-block mb-2 flex flex-row">
              Start Date
              <span className="text-xl text-red-500 pl-1">*</span>
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="inline-block w-full relative border-2 p-2 rounded-md"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
            />
          </div>

          <div className="form-group flex-shrink max-w-full px-4 mb-4">
            <label className="inline-block mb-2 flex flex-row">
              End Date
              <span className="text-xl text-red-500 pl-1">*</span>
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="inline-block w-full relative border-2 p-2 rounded-md"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select end date"
            />
          </div>

          <div className="pt-9">
            <input
              type="text"
              placeholder="Enter the Conductor Id"
              className="inline-block w-full relative border-2 p-2 rounded-md"
              value={conductorId}
              onChange={(e) => setConductorId(e.target.value)}
            />
          </div>
          <div className="pt-9">
            <button
              className="bg-[#4338CA] hover:bg-[#5f54df] px-7 ml-4 py-2 text-white font-semibold rounded shadow-lg"
              onClick={boqListingFunc}
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex mr-8 mt-4 justify-end ml-20">
          <div className="flex items-center ">
            {/* Export Functionality */}
            <div
              className="flex justify-between gap-4 py-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="text-red bg-[#4338CA] hover:before:bg-redborder-red-500 relative overflow-hidden border px-7 py-2 text-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4338CA] before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full rounded-md">
                <span className="relative z-10 flex">
                  Export{" "}
                  <FaArrowRightLong
                    color="white"
                    size={15}
                    className="mt-1 ml-3"
                  />
                </span>
              </button>

              <div
                className={`flex gap-2 transition-opacity duration-300 ${
                  isHovered ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <button
                  onClick={() => toPDF()} // Trigger PDF download
                  className="bg-[#4338CA] text-white px-2 rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs"
                >
                  PDF
                </button>

                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={`AccountantView-${activeTab}-${new Date().toISOString()}.csv`}
                  className="text-white"
                >
                  <button className="bg-[#4338CA] text-white px-2  rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs py-4">
                    CSV
                  </button>
                </CSVLink>
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={`AccountantView-${activeTab}-${new Date().toISOString()}.csv`}
                  className="text-white"
                >
                  <button className="bg-[#4338CA] text-white px-2 rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs py-4">
                    XLV
                  </button>
                </CSVLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-full bg-white rounded border mt-6 shadow-xl">
        <div className="flex items-center mr-3 m-4 pb-1 w-20 justify-center border-b border-black">
          {/* <img src={list} alt="List" className="" /> */}
          <span className="ml-2 text-gray-500">List</span>
        </div>
        {/* <div className="m-4 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="111"
            height="3"
            viewBox="0 0 111 3"
            fill="none"
          >
            <path
              d="M0.0203857 1.16992H110.601"
              stroke="#343434"
              strokeWidth="2.20061"
            />
          </svg>
        </div> */}

        <div className="flex w-full">
          <div className="flex-1 pt-2 pb-2 pl-1">
            <span className="text-gray-600 m-3">Total Results :&nbsp;</span>
            <span className="font-semibold">{totalResults}</span>{" "}
          </div>
        </div>

        {/* Table section */}
        <div ref={targetRef} className="p-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="p-2 border-b border-gray-300 font-semibold"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{data.date}</td>
                    <td className="px-6 py-4">{data.time}</td>
                    <td className="px-6 py-4">{data.amount}</td>
                    <td className="px-6 py-4">{data.payee}</td>
                    <td className="px-6 py-4">{data.id}</td>

                    <td className="px-6 py-4">{data.description}</td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-[#4338CA] text-white px-2 py-1 rounded hover:bg-[#373081]"
                        onClick={handleViewClick}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-2 px-4">
              <div>
                <span>Items per page: </span>
                <select
                  className="border rounded-md p-1"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center">
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="mx-2">
                  Page{" "}
                  <input
                    type="number"
                    value={currentPage}
                    onChange={handlePageChange}
                    className="w-12 border rounded-md text-center"
                  />{" "}
                  of {totalPages}
                </span>
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantViewPage;