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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast, { Toaster } from "react-hot-toast";
import createApiInstance from "../../../AxiosInstance";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const handleDownload = () => {
  const doc = new jsPDF();
  const columns = [
    { header: "Address" },
    { header: "Street Address" },
    { header: "Parking Type" },
    { header: "Zip / Postcode" },
    { header: "Parking Capacity" },
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

  doc.save("Parking_Area.pdf");
};
const thead = [
  { name: "Address" },
  { name: "Street Address" },
  { name: "Parking Type" },
  { name: "Sub Type" },
  { name: "Zip / Postcode" },
  { name: "Parking Rate" },
  { name: "Parking Capacity" },
  { name: "Agreement Document" },
  { name: "Status" },
  { name: "Actions" },
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

export default function ParkingArea({ location }) {
  // console.log(location);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [erroropen, set_erroropen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const BaseApi = createApiInstance("Base");
  const [filteredArea, setfilteredArea] = useState([]);

  const [delete_id, set_delete_id] = useState("");
  const [loadingdelete, set_loadingdelete] = useState(false);
  const [loading, set_loading] = useState(false);

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
    setSearchQuery(e.target.value);

    const filtered = data.filter((item) => {
      const itemValues =
        `${item.address}${item.landmark}${item.type_parking_space}${item.zip_code}`
          .toLowerCase()
          .replace(/\s/g, "");
      return itemValues.includes(query);
    });

    /* const filtered = data.filter((item) => {
      return (
        item.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.landmark.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.type_parking_space
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.zip_code.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }); */
    set_loading(false);
    setfilteredArea(filtered);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dataFetch(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    dataFetch(0, newRowsPerPage);
  };

  const token = localStorage.getItem("token");

  const getImage = async (referenceNumber) => {
    const response = await axios.post(
      `${process.env.REACT_APP_DMS}`,
      { referenceNo: referenceNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          token: "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
        },
      }
    );
    const url = response.data?.data?.fullPath;
    return url;
  };

  const dataFetch = async (newPage, newRowsPerPage) => {
    set_loading(true);
    BaseApi.get(`/get-parking-area?limit=${newRowsPerPage}&page=${newPage + 1}`)
      .then((response) => {
        if (response.data.status && response.data.data) {
          const promises = response.data.data.data.map(async (incharge) => {
            if (incharge.agreement_doc) {
              const agreement_doc_url = await getImage(incharge.agreement_doc);
              return { ...incharge, agreement_doc_url };
            } else {
              return incharge;
            }
          });

          Promise.all(promises).then((inchargesWithImages) => {
            set_loading(false);
            setData(inchargesWithImages);
            setfilteredArea(inchargesWithImages);
            setPage(response.data.data.page - 1);
            setTotalItems(response.data.data.totalItems);
          });
        }
      })
      .catch((error) => {
        set_loading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    dataFetch(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // console.log("data", data);

  const deletehandle = () => {
    set_loadingdelete(true);
    console.log("delete");
    const response = axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/delete-parking-area`,
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
        console.log(e);
        console.log("Response of data", e.data.data.id);
        if (e.data.data.id == delete_id) {
          errorhandleClose();
          set_loadingdelete(false);
          dataFetch(page, rowsPerPage);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleStatusToggle = (parkingAreaId, currentStatus) => {
  const updatedStatus = currentStatus === 1 ? 0 : 1;

  set_loading(true); // show loading indicator

  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}/parking-area/update-status`,
      {
        id: parkingAreaId,
        status: updatedStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      if (response.data?.data) {
        toast.success(
          updatedStatus === 1
            ? "Parking area activated successfully"
            : "Parking area deactivated successfully"
        );

        // ✅ Refresh the table data
        dataFetch(page, rowsPerPage);
      } else {
        toast.error("Something went wrong while updating status");
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to update parking area status");
    })
    .finally(() => {
      set_loading(false); // stop loading
    });
};




  // console.log("Data to be mapped: ", data);
  // console.log("Filter Area", filteredArea);

  return (
    <>
      <div className="flex flex-1 flex-row justify-center items-center">
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
            <Link to="/OnboardingParkingArea" className="flex flex-1">
              <Button
                variant="contained"
                sx={{ width: "100%", background: "#6366F1" }}
              >
                + Register New Parking
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Paper>
        <TableContainer style={styles.tableContainer} className="mt-5">
          <Table id="data-table" stickyHeader>
            <TableHead>
              <TableRow>
                {thead.map((item) => (
                  <TableCell style={styles.stickyHeader}>{item.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={thead?.length}
                    align="center"
                    style={{ padding: "20px", fontSize: "18px" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredArea?.length > 0 ? (
                filteredArea?.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.landmark}</TableCell>
                    <TableCell>{row.type_parking_space}</TableCell>
                    <TableCell>{row.sub_type_parking_space == null ? "N/A" : row.sub_type_parking_space}</TableCell>
                    <TableCell>{row.zip_code}</TableCell>
                    <TableCell>
                      <div className="flex flex-1 justify-start items-start flex-row gap-4">
                        <div className="flex gap-2">
                          <div
                            className="flex justify-center items-center h-[20px] w-[20px] rounded-full "
                            style={{ backgroundColor: "rgba(4, 145, 35, 0.2)" }}
                          >
                            <svg
                              className="flex"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 9.5V7.5L4.5 6L7 4L8 5.5H9.5M1 9C1 9.39782 1.15804 9.77936 1.43934 10.0607C1.72064 10.342 2.10218 10.5 2.5 10.5C2.89782 10.5 3.27936 10.342 3.56066 10.0607C3.84196 9.77936 4 9.39782 4 9C4 8.60218 3.84196 8.22064 3.56066 7.93934C3.27936 7.65804 2.89782 7.5 2.5 7.5C2.10218 7.5 1.72064 7.65804 1.43934 7.93934C1.15804 8.22064 1 8.60218 1 9ZM8 9C8 9.39782 8.15803 9.77936 8.43934 10.0607C8.72064 10.342 9.10217 10.5 9.5 10.5C9.89782 10.5 10.2794 10.342 10.5607 10.0607C10.842 9.77936 11 9.39782 11 9C11 8.60218 10.842 8.22064 10.5607 7.93934C10.2794 7.65804 9.89782 7.5 9.5 7.5C9.10217 7.5 8.72064 7.65804 8.43934 7.93934C8.15803 8.22064 8 8.60218 8 9ZM8 2.5C8 2.63261 8.05268 2.75979 8.14644 2.85355C8.24021 2.94732 8.36739 3 8.5 3C8.63261 3 8.75978 2.94732 8.85355 2.85355C8.94732 2.75979 9 2.63261 9 2.5C9 2.36739 8.94732 2.24021 8.85355 2.14645C8.75978 2.05268 8.63261 2 8.5 2C8.36739 2 8.24021 2.05268 8.14644 2.14645C8.05268 2.24021 8 2.36739 8 2.5Z"
                                stroke="#049123"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          {row.two_wheeler_rate}
                        </div>
                        <div className="flex gap-2">
                          <div
                            className="flex justify-center items-center h-[20px] w-[20px] rounded-full "
                            style={{
                              backgroundColor: "rgba(187, 134, 0, 0.2)",
                            }}
                          >
                            <svg
                              width="12"
                              className="flex"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.5 0.375C7.5 0.275544 7.53951 0.180161 7.60983 0.109835C7.68016 0.0395088 7.77554 0 7.875 0L10.875 0C10.9745 0 11.0698 0.0395088 11.1402 0.109835C11.2105 0.180161 11.25 0.275544 11.25 0.375V4.125C11.25 4.22446 11.2105 4.31984 11.1402 4.39016C11.0698 4.46049 10.9745 4.5 10.875 4.5H9.75V10.875C9.75 10.9745 9.71049 11.0698 9.64017 11.1402C9.56984 11.2105 9.47446 11.25 9.375 11.25C9.27554 11.25 9.18016 11.2105 9.10983 11.1402C9.03951 11.0698 9 10.9745 9 10.875V4.5H7.875C7.77554 4.5 7.68016 4.46049 7.60983 4.39016C7.53951 4.31984 7.5 4.22446 7.5 4.125V0.375ZM3.98925 1.5H6.75V2.25H3.98925C3.80694 2.24996 3.63085 2.31633 3.49392 2.43669C3.35699 2.55706 3.26859 2.72319 3.24525 2.904L3.039 4.5H6.81375C6.89133 4.71943 7.03506 4.9094 7.22513 5.04373C7.4152 5.17805 7.64226 5.25012 7.875 5.25H2.625C2.52554 5.25 2.43016 5.28951 2.35984 5.35984C2.28951 5.43016 2.25 5.52554 2.25 5.625V7.875C2.25 7.97446 2.28951 8.06984 2.35984 8.14017C2.43016 8.21049 2.52554 8.25 2.625 8.25H8.25V9H3.75V9.9375C3.75 10.0867 3.69074 10.2298 3.58525 10.3352C3.47976 10.4407 3.33668 10.5 3.1875 10.5C3.03832 10.5 2.89524 10.4407 2.78975 10.3352C2.68426 10.2298 2.625 10.0867 2.625 9.9375V9C2.32663 9 2.04048 8.88147 1.8295 8.6705C1.61853 8.45952 1.5 8.17337 1.5 7.875V5.625C1.49996 5.38773 1.57495 5.15652 1.71423 4.96443C1.85352 4.77234 2.04997 4.62921 2.2755 4.5555L2.283 4.5H1.875C1.77554 4.5 1.68016 4.46049 1.60984 4.39016C1.53951 4.31984 1.5 4.22446 1.5 4.125C1.5 4.02554 1.53951 3.93016 1.60984 3.85984C1.68016 3.78951 1.77554 3.75 1.875 3.75H2.37975L2.50125 2.808C2.54794 2.44624 2.72485 2.11389 2.99887 1.87314C3.27289 1.63239 3.62524 1.49974 3.99 1.5M8.0625 6.18825C8.1285 6.18825 8.19125 6.199 8.25075 6.2205V7.2795C8.16593 7.30999 8.07502 7.31959 7.98571 7.30749C7.89639 7.29539 7.81131 7.26196 7.73766 7.21001C7.66401 7.15806 7.60395 7.08914 7.56258 7.00906C7.52122 6.92899 7.49975 6.84013 7.5 6.75C7.5 6.4395 7.75125 6.18825 8.06175 6.18825M4.5 6.75C4.5 6.82377 4.48547 6.89682 4.45724 6.96497C4.42901 7.03313 4.38763 7.09505 4.33547 7.14722C4.2833 7.19938 4.22138 7.24076 4.15322 7.26899C4.08507 7.29722 4.01202 7.31175 3.93825 7.31175C3.86448 7.31175 3.79143 7.29722 3.72328 7.26899C3.65512 7.24076 3.5932 7.19938 3.54103 7.14722C3.48887 7.09505 3.44749 7.03313 3.41926 6.96497C3.39103 6.89682 3.3765 6.82377 3.3765 6.75C3.3765 6.60101 3.43568 6.45813 3.54103 6.35278C3.64638 6.24743 3.78926 6.18825 3.93825 6.18825C4.08724 6.18825 4.23012 6.24743 4.33547 6.35278C4.44082 6.45813 4.5 6.60101 4.5 6.75Z"
                                fill="#BB8600"
                              />
                            </svg>
                          </div>
                          {row.four_wheeler_rate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-1 justify-start items-start flex-row gap-4">
                        <div className="flex gap-2">
                          <div
                            className="flex justify-center items-center h-[20px] w-[20px] rounded-full "
                            style={{ backgroundColor: "rgba(4, 145, 35, 0.2)" }}
                          >
                            <svg
                              className="flex"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 9.5V7.5L4.5 6L7 4L8 5.5H9.5M1 9C1 9.39782 1.15804 9.77936 1.43934 10.0607C1.72064 10.342 2.10218 10.5 2.5 10.5C2.89782 10.5 3.27936 10.342 3.56066 10.0607C3.84196 9.77936 4 9.39782 4 9C4 8.60218 3.84196 8.22064 3.56066 7.93934C3.27936 7.65804 2.89782 7.5 2.5 7.5C2.10218 7.5 1.72064 7.65804 1.43934 7.93934C1.15804 8.22064 1 8.60218 1 9ZM8 9C8 9.39782 8.15803 9.77936 8.43934 10.0607C8.72064 10.342 9.10217 10.5 9.5 10.5C9.89782 10.5 10.2794 10.342 10.5607 10.0607C10.842 9.77936 11 9.39782 11 9C11 8.60218 10.842 8.22064 10.5607 7.93934C10.2794 7.65804 9.89782 7.5 9.5 7.5C9.10217 7.5 8.72064 7.65804 8.43934 7.93934C8.15803 8.22064 8 8.60218 8 9ZM8 2.5C8 2.63261 8.05268 2.75979 8.14644 2.85355C8.24021 2.94732 8.36739 3 8.5 3C8.63261 3 8.75978 2.94732 8.85355 2.85355C8.94732 2.75979 9 2.63261 9 2.5C9 2.36739 8.94732 2.24021 8.85355 2.14645C8.75978 2.05268 8.63261 2 8.5 2C8.36739 2 8.24021 2.05268 8.14644 2.14645C8.05268 2.24021 8 2.36739 8 2.5Z"
                                stroke="#049123"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          {row.two_wheeler_capacity}
                        </div>
                        <div className="flex gap-2">
                          <div
                            className="flex justify-center items-center h-[20px] w-[20px] rounded-full "
                            style={{
                              backgroundColor: "rgba(187, 134, 0, 0.2)",
                            }}
                          >
                            <svg
                              width="12"
                              className="flex"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.5 0.375C7.5 0.275544 7.53951 0.180161 7.60983 0.109835C7.68016 0.0395088 7.77554 0 7.875 0L10.875 0C10.9745 0 11.0698 0.0395088 11.1402 0.109835C11.2105 0.180161 11.25 0.275544 11.25 0.375V4.125C11.25 4.22446 11.2105 4.31984 11.1402 4.39016C11.0698 4.46049 10.9745 4.5 10.875 4.5H9.75V10.875C9.75 10.9745 9.71049 11.0698 9.64017 11.1402C9.56984 11.2105 9.47446 11.25 9.375 11.25C9.27554 11.25 9.18016 11.2105 9.10983 11.1402C9.03951 11.0698 9 10.9745 9 10.875V4.5H7.875C7.77554 4.5 7.68016 4.46049 7.60983 4.39016C7.53951 4.31984 7.5 4.22446 7.5 4.125V0.375ZM3.98925 1.5H6.75V2.25H3.98925C3.80694 2.24996 3.63085 2.31633 3.49392 2.43669C3.35699 2.55706 3.26859 2.72319 3.24525 2.904L3.039 4.5H6.81375C6.89133 4.71943 7.03506 4.9094 7.22513 5.04373C7.4152 5.17805 7.64226 5.25012 7.875 5.25H2.625C2.52554 5.25 2.43016 5.28951 2.35984 5.35984C2.28951 5.43016 2.25 5.52554 2.25 5.625V7.875C2.25 7.97446 2.28951 8.06984 2.35984 8.14017C2.43016 8.21049 2.52554 8.25 2.625 8.25H8.25V9H3.75V9.9375C3.75 10.0867 3.69074 10.2298 3.58525 10.3352C3.47976 10.4407 3.33668 10.5 3.1875 10.5C3.03832 10.5 2.89524 10.4407 2.78975 10.3352C2.68426 10.2298 2.625 10.0867 2.625 9.9375V9C2.32663 9 2.04048 8.88147 1.8295 8.6705C1.61853 8.45952 1.5 8.17337 1.5 7.875V5.625C1.49996 5.38773 1.57495 5.15652 1.71423 4.96443C1.85352 4.77234 2.04997 4.62921 2.2755 4.5555L2.283 4.5H1.875C1.77554 4.5 1.68016 4.46049 1.60984 4.39016C1.53951 4.31984 1.5 4.22446 1.5 4.125C1.5 4.02554 1.53951 3.93016 1.60984 3.85984C1.68016 3.78951 1.77554 3.75 1.875 3.75H2.37975L2.50125 2.808C2.54794 2.44624 2.72485 2.11389 2.99887 1.87314C3.27289 1.63239 3.62524 1.49974 3.99 1.5M8.0625 6.18825C8.1285 6.18825 8.19125 6.199 8.25075 6.2205V7.2795C8.16593 7.30999 8.07502 7.31959 7.98571 7.30749C7.89639 7.29539 7.81131 7.26196 7.73766 7.21001C7.66401 7.15806 7.60395 7.08914 7.56258 7.00906C7.52122 6.92899 7.49975 6.84013 7.5 6.75C7.5 6.4395 7.75125 6.18825 8.06175 6.18825M4.5 6.75C4.5 6.82377 4.48547 6.89682 4.45724 6.96497C4.42901 7.03313 4.38763 7.09505 4.33547 7.14722C4.2833 7.19938 4.22138 7.24076 4.15322 7.26899C4.08507 7.29722 4.01202 7.31175 3.93825 7.31175C3.86448 7.31175 3.79143 7.29722 3.72328 7.26899C3.65512 7.24076 3.5932 7.19938 3.54103 7.14722C3.48887 7.09505 3.44749 7.03313 3.41926 6.96497C3.39103 6.89682 3.3765 6.82377 3.3765 6.75C3.3765 6.60101 3.43568 6.45813 3.54103 6.35278C3.64638 6.24743 3.78926 6.18825 3.93825 6.18825C4.08724 6.18825 4.23012 6.24743 4.33547 6.35278C4.44082 6.45813 4.5 6.60101 4.5 6.75Z"
                                fill="#BB8600"
                              />
                            </svg>
                          </div>
                          {row.four_wheeler_capacity}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {row?.agreement_doc_url ? (
                        <img
                          className="w-20 h-20"
                          src={row?.agreement_doc_url}
                        />
                      ) : (
                        <div className="text-red-500 p-4 bg-red-200 w-fit font-bold rounded-md">
                          Not Uploaded
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row?.status === 1 ? (
                          <div
                            className="text-green-500 text-xs p-2 bg-green-100 w-fit font-bold rounded-md cursor-pointer"
                            onClick={() => handleStatusToggle(row.id, 1)} // 1 = active
                          >
                            Active
                          </div>
                        ) : (
                          <div
                            className="text-red-500 text-xs p-2 bg-red-200 w-fit font-bold rounded-md cursor-pointer"
                            onClick={() => handleStatusToggle(row.id, 0)} // 0 = inactive
                          >
                            Inactive
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div style={styles.actionButtons}>
                        <div className="flex flex-row gap-4">
                          <div
                            onClick={() => errorhandleClickOpen(row.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex">
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.95455 4H13.0455C13.0455 3.50272 12.83 3.02581 12.4464 2.67417C12.0628 2.32254 11.5425 2.125 11 2.125C10.4575 2.125 9.93724 2.32254 9.55365 2.67417C9.17005 3.02581 8.95455 3.50272 8.95455 4ZM7.72727 4C7.72727 3.20435 8.07208 2.44129 8.68583 1.87868C9.29959 1.31607 10.132 1 11 1C11.868 1 12.7004 1.31607 13.3142 1.87868C13.9279 2.44129 14.2727 3.20435 14.2727 4H19.3864C19.5491 4 19.7052 4.05926 19.8203 4.16475C19.9354 4.27024 20 4.41332 20 4.5625C20 4.71168 19.9354 4.85476 19.8203 4.96025C19.7052 5.06574 19.5491 5.125 19.3864 5.125H18.3145L17.3188 16.0773C17.2464 16.874 16.8499 17.6167 16.2081 18.1581C15.5663 18.6994 14.726 18.9999 13.8538 19H8.14618C7.27399 18.9999 6.43368 18.6994 5.79187 18.1581C5.15006 17.6167 4.75362 16.874 4.68118 16.0773L3.68545 5.125H2.61364C2.45089 5.125 2.29481 5.06574 2.17973 4.96025C2.06465 4.85476 2 4.71168 2 4.5625C2 4.41332 2.06465 4.27024 2.17973 4.16475C2.29481 4.05926 2.45089 4 2.61364 4H7.72727ZM5.90436 15.9835C5.95115 16.4991 6.2076 16.9797 6.62285 17.33C7.03809 17.6804 7.58181 17.8749 8.14618 17.875H13.8538C14.4182 17.8749 14.9619 17.6804 15.3772 17.33C15.7924 16.9797 16.0488 16.4991 16.0956 15.9835L17.084 5.125H4.91682L5.90436 15.9835ZM9.15909 7.75C9.32184 7.75 9.47792 7.80926 9.593 7.91475C9.70808 8.02024 9.77273 8.16332 9.77273 8.3125V14.6875C9.77273 14.8367 9.70808 14.9798 9.593 15.0852C9.47792 15.1907 9.32184 15.25 9.15909 15.25C8.99634 15.25 8.84026 15.1907 8.72518 15.0852C8.61011 14.9798 8.54545 14.8367 8.54545 14.6875V8.3125C8.54545 8.16332 8.61011 8.02024 8.72518 7.91475C8.84026 7.80926 8.99634 7.75 9.15909 7.75ZM13.4545 8.3125C13.4545 8.16332 13.3899 8.02024 13.2748 7.91475C13.1597 7.80926 13.0037 7.75 12.8409 7.75C12.6782 7.75 12.5221 7.80926 12.407 7.91475C12.2919 8.02024 12.2273 8.16332 12.2273 8.3125V14.6875C12.2273 14.8367 12.2919 14.9798 12.407 15.0852C12.5221 15.1907 12.6782 15.25 12.8409 15.25C13.0037 15.25 13.1597 15.1907 13.2748 15.0852C13.3899 14.9798 13.4545 14.8367 13.4545 14.6875V8.3125Z"
                                  fill="#333333"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={thead?.length}
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
            Do You Want to Delete the Parking Area ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button onClick={deletehandle} variant="contained" color="error">
            {loadingdelete ? "loading..." : "confirm"}
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
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
