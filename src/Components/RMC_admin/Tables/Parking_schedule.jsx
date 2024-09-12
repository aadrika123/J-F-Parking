import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { Field, FieldArray, Formik } from "formik";

const handleDownload = () => {
  const doc = new jsPDF();

  const columns = [
    { header: "Address" },
    { header: "Post Code" },
    { header: "Incharge Name" },
    { header: "Incharge ID" },
    { header: "From Date" },
    { header: "To Date" },
    { header: "From" },
    { header: "To" },
    { header: "Created At" },
  ];

  const data = [];
  const table = document.getElementById("data-table");
  console.log(table);
  const rows = table?.querySelectorAll("tbody tr") || [];
  rows.forEach((row) => {
    const rowData = [];
    row.querySelectorAll("td").forEach((cell) => {
      const cellData = cell?.textContent?.trim() || "";
      rowData.push(cellData);
    });
    data.push(rowData);
  });

  autoTable(doc, {
    head: [columns.map((column) => column.header)],
    body: data,
  });

  doc.save("Parking_Schedule.pdf");
};

const thead = [
  { name: "Address" },
  { name: "Post Code" },
  { name: "Incharge Name" },
  { name: "Incharge ID" },
  { name: "From Date" },
  { name: "To Date " },
  { name: "From" },
  { name: "To" },
  { name: "Created At" },

  /*   { name: "Schedule Type" },
   */ { name: "Actions" },
  // { name: "Extended Hours" },
];

const styles = {
  tableContainer: {
    maxHeight: "60vh",
  },
  stickyHeader: {
    fontWeight: "bold",
    color: "#000000",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
};
export default function ParkingSchedule() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [erroropen, set_erroropen] = useState(false);

  const [delete_id, set_delete_id] = useState("");
  const token = localStorage.getItem("token");
  const [deleteLoading, set_deleteLoading] = useState(false);
  const [loading, set_loading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [extraHour, setExtraHour] = useState('')



  const errorhandleClickOpen = (id) => {
    set_delete_id(id);
    set_erroropen(true);
  };

  const errorhandleClose = () => {
    set_erroropen(false);
  };

  const handleSearchChange = (e) => {
    set_loading(true);
    const query = e.target.value.toLowerCase().replace(/\s/g, "");
    const filtered = data.filter((item) => {
      const itemValues =
        `${item.address}${item.first_name}${item.middle_name}${item.last_name}${item.incharge_id}`
          .toLowerCase()
          .replace(/\s/g, "");
      return itemValues.includes(query);
    });
    set_loading(false)
    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setSearchQuery(e.target.value);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };
  function formatTime(timeStr) {
    if (timeStr.length === 4) {
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      //const seconds = timeStr.substring(4, 6);
      return `${hours}:${minutes}`;
    }
    return timeStr; // Return the original string if it doesn't match the expected length
  }
  const dataFetch = async (newPage, newRowsPerPage) => {
    set_loading(true)
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL
        }/get-schedule?limit=${newRowsPerPage}&page=${newPage + 1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Debug: Log the API response
      console.log("API response:", response);
      setTotalItems(response.data?.data?.totalItems);

      if (Array.isArray(response.data.data.data)) {
        set_loading(false)
        setData(response.data.data.data); // Ensure the response contains a 'data' field with an array of items
        setFilteredData(response.data.data.data);

      } else {
        console.error(
          "API response data is not an array",
          response.data.data.data
        );
        setData([]);
        set_loading(false)// Default to an empty array if the data is not an array
      }

      setTotalItems(response.data?.data?.totalItems); // Ensure the response contains a 'totalItems' field with the total count
    } catch (error) {
      console.error("There was an error fetching the schedule!", error);
    }
  };

  useEffect(() => {
    dataFetch(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dataFetch(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when changing rowsPerPage
    dataFetch(0, newRowsPerPage);
  };

  const deletehandle = () => {
    set_deleteLoading(true);
    const response = axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/delete-schedule`,
        {
          id: delete_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((e) => {
        console.log(e.data?.data?.deleted);
        if (e.data?.data?.deleted == delete_id) {
          set_deleteLoading(false);
          dataFetch(page, rowsPerPage);
          errorhandleClose();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
  };

  const [initialValues, setInitialValues] = useState({
    address: "",
    from_time: "",
    to_time: "",
    from_date: "",
    to_date: "",
    first_name: "",
    last_name: "",
    incharge_id: ""
  });

  const [originalToTime, setOriginalToTime] = useState("");


  const edithandleClickOpen = (id) => {
    const filteredData = data.find((item) => item.id === id);
    if (filteredData) {
      const fromDateTime = filteredData.from_date.split("T");
      const toDateTime = filteredData.to_date.split("T");
      setInitialValues({
        address: filteredData.address,
        from_time: filteredData.from_time,
        to_time: filteredData.to_time,
        from_date: fromDateTime[0],
        to_date: toDateTime[0],
        first_name: filteredData.first_name,
        last_name: filteredData.last_name,
        incharge_id: filteredData.incharge_id,
      });
      setSelectedItem(id);
      setIsPopupVisible(true);
      setOriginalToTime(filteredData.to_time);
    }
  };

  const calculateExtendedHours = (originalTime, updatedTime) => {
    const originalDate = new Date(`1970-01-01T${originalTime}`);
    const updatedDate = new Date(`1970-01-01T${updatedTime}`);
    const diffMs = updatedDate - originalDate;
    const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours: diffHours, minutes: diffMinutes };
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  }

  const dataUpdate = async (values) => {
    console.log("values", values)

    let extendedHours = { hours: 0, minutes: 0 };
    if (values.to_time !== originalToTime) {
      extendedHours = calculateExtendedHours(
        initialValues.to_time,
        values.to_time
      );
    }

    console.log("Updated values", {
      ...values,
      id: selectedItem
    });
    console.log("Extended hours", extendedHours);
    setExtraHour(extendedHours);

    const response = axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/update-schedule`,
        {
          ...values,
          extended_hours: extendedHours,
          id: selectedItem
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((e) => {
        console.log(e.data);
        // if (e.data?.data?.deleted == delete_id) {
        //   set_deleteLoading(false);
        //   dataFetch(page, rowsPerPage);
        //   errorhandleClose();
        // } else {
        //   toast.error("Something went wrong");
        // }
      })
      .catch((e) => {
        console.log(e);
      });


  };

  console.log("extraHour", extraHour);

  return (
    <div className="flex flex-1 flex-col">
      <div style={{ flex: 2 }} className="flex justify-center items-center">
        <div style={{ flex: 2 }} className="flex mr-4 ml-4 ">
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
          />
        </div>
        <div className="flex flex-1 mr-4">
          <Button
            variant="contained"
            sx={{ width: "100%", backgroundColor: "#6366F1", color: "white" }}
            onClick={handleDownload}
          >
            <div className="flex flex-1 justify-center items-center flex-row">
              <div className="flex ">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4987 7.1875H6.70703C6.32578 7.1875 5.96015 7.33895 5.69057 7.60853C5.42098 7.87812 5.26953 8.24375 5.26953 8.625V16.2917C5.26953 16.6729 5.42098 17.0385 5.69057 17.3081C5.96015 17.5777 6.32578 17.7292 6.70703 17.7292H14.3737C14.7549 17.7292 15.1206 17.5777 15.3902 17.3081C15.6597 17.0385 15.8112 16.6729 15.8112 16.2917V11.5"
                    stroke="white"
                    stroke-linecap="round"
                  />
                  <path
                    d="M11.9766 11.0208L18.0754 4.922M13.8932 4.3125H18.6849V9.10417"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex ">Export</div>
            </div>
          </Button>
        </div>
        <div className="flex flex-1 mr-4">
          <Link to="/Scheduling" className="flex flex-1">
            <Button
              variant="contained"
              sx={{ width: "100%", background: "#6366F1" }}
            >
              + New Schedule
            </Button>
          </Link>
        </div>
      </div>
      <Paper>
        <TableContainer style={styles.tableContainer}>
          <Table id="data-table" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {thead.map((item, index) => (
                  <TableCell key={index}>{item.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={thead.length}
                    align="center"
                    style={{ padding: "20px", fontSize: "18px" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData?.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.first_name}</TableCell>
                    <TableCell>{row.incharge_id}</TableCell>
                    <TableCell>{formatDate(row.from_date)}</TableCell>
                    <TableCell>{formatDate(row.to_date)}</TableCell>
                    <TableCell>{formatTime(row.from_time)}</TableCell>
                    <TableCell>{row.to_time}</TableCell>
                    <TableCell>{formatDate(row.created_at)}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <div>
                          <div className="flex flex-row gap-4">
                            <div
                              onClick={() => {
                                edithandleClickOpen(row.id);
                              }}
                              className="flex cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="23"
                                height="20"
                                viewBox="0 0 23 20"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_1440_7941)">
                                  <rect
                                    x="1.63591"
                                    y="0.63591"
                                    width="18.7282"
                                    height="18.7282"
                                    rx="4.36409"
                                    stroke="#726E6E"
                                    strokeWidth="1.27182"
                                  />
                                  <path
                                    d="M15.5263 8.02097C15.3434 8.19095 15.1659 8.35592 15.1605 8.5209C15.1444 8.68088 15.3273 8.84585 15.4994 9.00083C15.7576 9.2508 16.0104 9.47577 15.9997 9.72073C15.9889 9.9657 15.7146 10.2207 15.4402 10.4706L13.2187 12.5403L12.4549 11.8304L14.741 9.71073L14.2246 9.2308L13.4608 9.9357L11.4436 8.06096L13.5092 6.14623C13.7189 5.95126 14.0686 5.95126 14.2676 6.14623L15.5263 7.31607C15.7361 7.50104 15.7361 7.826 15.5263 8.02097ZM6 13.1253L11.1424 8.34092L13.1595 10.2157L8.01715 15H6V13.1253Z"
                                    fill="black"
                                    fillOpacity="0.41"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1440_7941">
                                    <rect
                                      width="22.7692"
                                      height="19.7333"
                                      fill="white"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-row gap-4">
                            {/*Delete */}
                            <div
                              onClick={() => {
                                errorhandleClickOpen(row.id);
                              }}
                              className="flex cursor-pointer"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.95455 3H11.0455C11.0455 2.50272 10.83 2.02581 10.4464 1.67417C10.0628 1.32254 9.54249 1.125 9 1.125C8.45751 1.125 7.93724 1.32254 7.55365 1.67417C7.17005 2.02581 6.95455 2.50272 6.95455 3ZM5.72727 3C5.72727 2.20435 6.07208 1.44129 6.68583 0.87868C7.29959 0.316071 8.13202 0 9 0C9.86798 0 10.7004 0.316071 11.3142 0.87868C11.9279 1.44129 12.2727 2.20435 12.2727 3H17.3864C17.5491 3 17.7052 3.05926 17.8203 3.16475C17.9354 3.27024 18 3.41332 18 3.5625C18 3.71168 17.9354 3.85476 17.8203 3.96025C17.7052 4.06574 17.5491 4.125 17.3864 4.125H16.3145L15.3188 15.0773C15.2464 15.874 14.8499 16.6167 14.2081 17.1581C13.5663 17.6994 12.726 17.9999 11.8538 18H6.14618C5.27399 17.9999 4.43368 17.6994 3.79187 17.1581C3.15006 16.6167 2.75362 15.874 2.68118 15.0773L1.68545 4.125H0.613636C0.45089 4.125 0.294809 4.06574 0.17973 3.96025C0.0646507 3.85476 0 3.71168 0 3.5625C0 3.41332 0.0646507 3.27024 0.17973 3.16475C0.294809 3.05926 0.45089 3 0.613636 3H5.72727ZM3.90436 14.9835C3.95115 15.4991 4.2076 15.9797 4.62285 16.33C5.03809 16.6804 5.58181 16.8749 6.14618 16.875H11.8538C12.4182 16.8749 12.9619 16.6804 13.3772 16.33C13.7924 15.9797 14.0488 15.4991 14.0956 14.9835L15.084 4.125H2.91682L3.90436 14.9835ZM7.15909 6.75C7.32184 6.75 7.47792 6.80926 7.593 6.91475C7.70808 7.02024 7.77273 7.16332 7.77273 7.3125V13.6875C7.77273 13.8367 7.70808 13.9798 7.593 14.0852C7.47792 14.1907 7.32184 14.25 7.15909 14.25C6.99634 14.25 6.84026 14.1907 6.72518 14.0852C6.61011 13.9798 6.54545 13.8367 6.54545 13.6875V7.3125C6.54545 7.16332 6.61011 7.02024 6.72518 6.91475C6.84026 6.80926 6.99634 6.75 7.15909 6.75ZM11.4545 7.3125C11.4545 7.16332 11.3899 7.02024 11.2748 6.91475C11.1597 6.80926 11.0037 6.75 10.8409 6.75C10.6782 6.75 10.5221 6.80926 10.407 6.91475C10.2919 7.02024 10.2273 7.16332 10.2273 7.3125V13.6875C10.2273 13.8367 10.2919 13.9798 10.407 14.0852C10.5221 14.1907 10.6782 14.25 10.8409 14.25C11.0037 14.25 11.1597 14.1907 11.2748 14.0852C11.3899 13.9798 11.4545 13.8367 11.4545 13.6875V7.3125Z"
                                  fill="#333333"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isPopupVisible && (
                        <>
                          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl h-auto space-y-8 transform transition-transform duration-300 ease-out scale-95">
                              <div className="flex  justify-end">
                                <button
                                  onClick={handleClosePopup}
                                  className="text-white py-1 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-red-700"
                                >
                                  X
                                </button>
                              </div>
                              <div>
                                <Formik
                                  initialValues={initialValues}
                                  enableReinitialize={true}
                                  onSubmit={(values) => dataUpdate(values)}
                                >
                                  {({
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                  }) => (
                                    <form
                                      onSubmit={handleSubmit}
                                      className="relative"
                                    >
                                      <div className="grid grid-cols-3 2xl:grid-cols-3 gap-x-6 gap-4 ">
                                        {/* ------------------------------------------------------- */}
                                        <div>
                                          <label htmlFor="email">
                                            Email Address
                                          </label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.address}
                                            label="Address."
                                            name="address"
                                            type="text"
                                            placeholder={"Enter Address."}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="email">From</label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.from_date}
                                            label="From"
                                            name="from_date"
                                            type="text"
                                            placeholder={"From Date"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="email">To</label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.to_date}
                                            label="To"
                                            name="to_date"
                                            type="text"
                                            placeholder={"To Date"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor="email">
                                            From Time
                                          </label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.from_time}
                                            label="From Time"
                                            name="from_time"
                                            type="text"
                                            placeholder={"From Time"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor="email">To Time</label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.to_time}
                                            label="From Time"
                                            name="to_time"
                                            type="text"
                                            placeholder={"To Time"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor="email">
                                            First Name
                                          </label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.first_name}
                                            label="First Name"
                                            name="first_name"
                                            type="text"
                                            placeholder={"First Name"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor="email">
                                            Last Name
                                          </label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.last_name}
                                            label="Last Name"
                                            name="last_name"
                                            type="text"
                                            placeholder={"Last Name"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor="email">
                                            Incharge Id
                                          </label>
                                          <br></br>
                                          <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.incharge_id}
                                            label="Incharge Id"
                                            name="incharge_id"
                                            type="text"
                                            placeholder={"Incharge Id"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div>

                                        {/* <div>
                                          <label htmlFor="extended_hours">
                                            Extended Hours
                                          </label>
                                          <br></br>
                                          <input
                                            disabled
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={`${Number(extraHour?.hours)}:${Number(extraHour?.minutes)}`}
                                            label="Extended Hours"
                                            name="extended_hours"
                                            type="text"
                                            placeholder={"Extended Hours"}
                                            maxLength={10}
                                            className="border p-2"
                                          />
                                        </div> */}
                                      </div>

                                      <div className="flex items-center justify-end mt-5 gap-5">
                                        <button
                                          buttonType="submit"
                                          variant="primary"
                                          className="bg-[#5457D6] text-white p-2 rounded-md"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </form>
                                  )}
                                </Formik>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={thead.length}
                    align="center"
                    style={{ padding: "20px", fontSize: "18px" }}
                  >
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={erroropen}
        onClose={errorhandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          className="bg-red-100 text-red-600 font-bold"
          id="alert-dialog-title"
        >
          {"Delete Schedule ? "}
        </DialogTitle>
        <DialogContent className="bg-red-100">
          <DialogContentText id="alert-dialog-description">
            Do You Want to Delete the Schedule
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button onClick={deletehandle} variant="contained" color="error">
            {deleteLoading ? "loading..." : "Confirm"}
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={errorhandleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
