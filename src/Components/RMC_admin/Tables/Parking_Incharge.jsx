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
import createApiInstance from "../../../AxiosInstance";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast, { Toaster } from "react-hot-toast";

import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const handleDownload = () => {
  const doc = new jsPDF();
  const columns = ["S.N", "Full Name", "Email", "Location", "Unique ID"];

  const data = [];
  const table = document.getElementById("data-table");
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
    head: [columns],
    body: data,
  });

  doc.save("Parking_Incharge.pdf");
};

export default function Parking_Incharge() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const BaseApi = createApiInstance("Base");
  const [incharges, setIncharges] = useState([]);
  const [filteredIncharges, setFilteredIncharges] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const token = localStorage.getItem("token");

  const [errorOpen, setErrorOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [tableData, setTableData] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, set_loading] = useState(false);

  const thead = [
    { name: "S.N" },
    { name: "Full Name" },
    { name: "Email" },
    { name: "Location" },
    { name: "Unique ID" },
    { name: "Fitness Doc" },
    { name: "KYC Doc" },
    { name: "Approval Status" },
    { name: "Actions" },
  ];

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setErrorOpen(true);
  };

  const handleClose = () => {
    setErrorOpen(false);
  };

  const handleApprovalToggle = (id, currentStatus) => {
    set_loading(true);
    BaseApi.post(
      `/update-parking-incharge?id=${id}`,
      { is_approved: !currentStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.data) {
          toast.success("Approval status updated");
          BaseApi.get(
            `/get-parking-incharge?limit=${rowsPerPage}&page=${page + 1}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => {
              setTableData(res?.data?.data); // assuming you have a setter
            })
            .catch((err) => {
              console.error("Failed to fetch updated list", err);
              toast.error("Failed to refresh list");
            });
        } else {
          toast.error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Failed to update approval status", error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        set_loading(false);
      });
  };

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

  const fetchData = (newPage, newRowsPerPage) => {
    set_loading(true);
    BaseApi.get(
      `/get-parking-incharge?limit=${newRowsPerPage}&page=${newPage + 1}`
    )
      .then((response) => {
        if (response.data.status && response.data.data) {
          const promises = response.data.data.data.map(async (incharge) => {
            if (incharge.kyc_doc && incharge.fitness_doc) {
              const kycDocUrl = await getImage(incharge.kyc_doc);
              const fitnessDocUrl = await getImage(incharge.fitness_doc);
              return { ...incharge, kycDocUrl, fitnessDocUrl };
            } else {
              return incharge;
            }
          });

          Promise.all(promises).then((inchargesWithImages) => {
            set_loading(false);
            setIncharges(inchargesWithImages);
            setFilteredIncharges(inchargesWithImages);
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
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "");
    const normalizedSearchQuery = normalizeString(searchQuery);

    const filtered = incharges.filter((incharge) => {
      const fullName = `${incharge.first_name || ""} ${
        incharge.middle_name || ""
      } ${incharge.last_name || ""}`;
      return (
        normalizeString(fullName).includes(normalizedSearchQuery) ||
        normalizeString(incharge.email_id || "").includes(
          normalizedSearchQuery
        ) ||
        normalizeString(incharge.address || "").includes(
          normalizedSearchQuery
        ) ||
        normalizeString(incharge.cunique_id || "").includes(
          normalizedSearchQuery
        )
      );
    });
    setFilteredIncharges(filtered);
  }, [searchQuery, incharges]);

  const handleDelete = () => {
    setLoadingDelete(true);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/delete-parking-incharge`,
        { id: deleteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
       
        if (response.data.data.id === deleteId) {
          fetchData(page, rowsPerPage);
          handleClose();
          setLoadingDelete(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete");
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when changing rowsPerPage
    fetchData(0, newRowsPerPage);
  };


  // fucntion for making the unapproved to approve 

  const handleappve =(incharge_id,status)=>{
    console.log("incharge_id",incharge_id,status)
    
    setLoadingDelete(true);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/update-parking-incharge?id=${incharge_id}`,
        { is_approved: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.data) {
          fetchData(page, rowsPerPage);
          setLoadingDelete(false);
          toast.success(response.data.message)
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete");
      });



  }

  return (
    <div className="flex flex-1 flex-col ">
      <div
        style={{ flex: 2 }}
        className="flex justify-center items-center mb-4"
      >
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
          <Link to="/OnboardingParkingIncharge" className="flex flex-1">
            <Button
              variant="contained"
              sx={{ width: "100%", background: "#6366F1" }}
            >
              + Register New Incharge
            </Button>
          </Link>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "60vh" }}>
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
                    colSpan={thead?.length}
                    align="center"
                    style={{ padding: "20px", fontSize: "18px" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredIncharges?.length > 0 ? (
                filteredIncharges.map((incharge, index) => (
                  <TableRow key={incharge.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {`${incharge.first_name || ""} ${
                        incharge.middle_name || ""
                      } ${incharge.last_name || ""}`}
                    </TableCell>
                    <TableCell>{incharge.email_id}</TableCell>
                    <TableCell>{incharge.address}</TableCell>
                    <TableCell>{incharge.cunique_id}</TableCell>
                    <TableCell>
                      {incharge.fitnessDocUrl ? (
                        <img
                          className="w-20 h-20"
                          src={incharge.fitnessDocUrl}
                          alt="Fitness Doc"
                        />
                      ) : (
                        <div className="text-red-500 p-2 text-xs bg-red-200 w-fit font-bold rounded-md">
                          Not Uploaded
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {incharge.kycDocUrl ? (
                        <img
                          className="w-20 h-20"
                          src={incharge.kycDocUrl}
                          alt="KYC Doc"
                        />
                      ) : (
                        <div className="text-red-500 text-xs p-2 bg-red-200 w-fit font-bold rounded-md">
                          Not Uploaded
                        </div>
                      )}
                    </TableCell>
                   <TableCell>
                 <div className="flex items-center gap-2">
                {incharge.is_approved ? (
                       <div className="text-green-500 text-xs p-2 bg-green-100 w-fit font-bold rounded-md cursor-pointer" onClick={() => handleappve(incharge.id,false)}>
                      Approved
                     </div>
                    ) : (
                    <div className="text-red-500 p-2 text-xs bg-red-200 w-fit font-bold rounded-md cursor-pointer" onClick={() => handleappve(incharge.id,true)}
>
                      Un-Approved
                     </div>
                      )}
                    </div>
                  </TableCell>
                    <TableCell>
                      <div className="flex flex-1 flex-row">
                        <Button onClick={() => handleClickOpen(incharge.id)}>
                          Delete
                        </Button>
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
        open={errorOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this incharge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            {loadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
