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
import Scheduling_modal from "./Scheduling_modal";

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
  { name: "Extended HRS" },
  { name: "Created At" },

  /*   { name: "Schedule Type" },
   */ { name: "Actions" },
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
  const [scheduling, set_scheduling] = useState(false);
  const [modalData, setModalData] = useState(null);

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
    set_loading(false);
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
    set_loading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BASE_URL
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
        set_loading(false);
        setData(response.data.data.data); // Ensure the response contains a 'data' field with an array of items
        setFilteredData(response.data.data.data);
      } else {
        console.error(
          "API response data is not an array",
          response.data.data.data
        );
        setData([]);
        set_loading(false); // Default to an empty array if the data is not an array
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

  // console.log(modalData,"modalData")

  if (scheduling) {
    return (
      <>
        <Scheduling_modal
          set_scheduling={set_scheduling}
          initialData={modalData}
        />
      </>
    );
  }

  const handleEditClick = (row) => {
    setModalData(row); // Set the data for the modal
    set_scheduling(true); // Open the modal
  };

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
                    <TableCell>
                      {row.extended_hours && row.extended_hours.length > 0
                        ? row.extended_hours[row.extended_hours.length - 1]
                        : "N/A"}
                    </TableCell>
                    <TableCell>{formatDate(row.created_at)}</TableCell>

                    <TableCell>
                      <div className="flex space-x-4">
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

                        <div className="flex flex-row gap-4">
                          {/*Edit */}
                          <div
                            // onClick={() => {
                            //   // errorhandleClickOpen(row.id);
                            //   set_scheduling(true)
                            // }}

                            onClick={() => handleEditClick(row)}
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
                                d="M16.1437 4.23975L13.7603 1.85637C13.5083 1.60435 13.17 1.46533 12.8183 1.46533C12.4666 1.46533 12.1283 1.60435 11.8763 1.85637L2.59875 11.134C2.47 11.2627 2.37237 11.4197 2.31375 11.5935L1.02975 15.4455C0.99453 15.5491 0.986999 15.6595 1.00784 15.7674C1.02869 15.8754 1.07727 15.9778 1.14961 16.0664C1.22195 16.1551 1.31577 16.2274 1.42322 16.2776C1.53067 16.3278 1.64858 16.3547 1.76812 16.3565C1.83775 16.3584 1.90737 16.3506 1.97475 16.3332L5.82675 15.0492C6.00163 14.9907 6.15955 14.8924 6.289 14.7642L15.5665 5.48662C15.8185 5.23464 15.9575 4.89629 15.9575 4.54462C15.9575 4.19295 15.8185 3.8546 15.5665 3.60262L16.1437 4.23975ZM12.4005 2.38087C12.4353 2.34614 12.4772 2.31874 12.5237 2.30027C12.5701 2.28181 12.62 2.27262 12.6705 2.27322C12.721 2.27382 12.7707 2.28419 12.8166 2.30376C12.8625 2.32332 12.9036 2.35173 12.9375 2.38737L15.321 4.77075C15.3567 4.80463 15.3851 4.84574 15.4047 4.89165C15.4242 4.93756 15.4346 4.98727 15.4352 5.03775C15.4358 5.08823 15.4266 5.13819 15.4082 5.18456C15.3897 5.23093 15.3624 5.27271 15.3277 5.30737L14.0452 6.59662L11.112 3.66337L12.4005 2.38087ZM10.5885 4.18787L13.5217 7.12112L5.8095 14.8334C5.75687 14.886 5.69546 14.927 5.62812 14.9542L2.57475 16.0057L3.62625 12.9524C3.65348 12.885 3.69444 12.8236 3.747 12.771L10.5885 4.18787Z"
                                fill="#333333"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
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
