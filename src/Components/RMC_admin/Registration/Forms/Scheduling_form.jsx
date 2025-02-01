import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, TextField } from "@mui/material";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialValues = {
  location_id: "",
  // Address: "",
  // Zip_postcode: "",
  // Incharge_Name: "",
  incharge_id: "",
  from_date: "",
  from_time: "",
  to_date: "",
  to_time: "",
  // Schedule_type: "",
};

const validationSchema = Yup.object({
  //location_id: Yup.string().required("Required Location Id"),
  //location_id: Yup.number().required("Required Location Id"),
  // Address: Yup.string().required("Required"),
  //zip_code: Yup.string().required("Required"),
  // Incharge_Name: Yup.string().required("Required"),
  //incharge_id: Yup.string().required("Required"),
  from_date: Yup.string().required("Required"),
  from_time: Yup.string().required("Required"),
  to_date: Yup.string().required("Required"),
  to_time: Yup.string().required("Required"),
  // Schedule_type: Yup.string().required("Required"),
});

export default function Scheduling_form() {
  const [loading, set_loading] = useState(false);
  const token = localStorage.getItem("token");
  const [parkingarea, set_parkingarea] = useState([]);
  const [zip_code, set_zip_code] = useState("");
  const [incharge, set_incharge] = useState([]);
  const [selected_area, set_selected_area] = useState({});
  const [selected_incharge, set_selected_incharge] = useState([]);
  const [UpdateData, set_UpdateData] = useState({});
  const navigate = useNavigate();

  //console.log(incharge);
  // console.log(parkingarea);
  // console.log("Selected Incharge >> ", selected_incharge);
  const [erroropen, set_erroropen] = useState(false);

  const errorhandleClickOpen = () => {
    set_erroropen(true);
  };

  const errorhandleClose = () => {
    set_erroropen(false);
  };

  const handleUpdate = (e) => { };
  function generateTimeOptions(intervalMinutes) {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const hourString = hour.toString().padStart(2, "0");
        const minuteString = minute.toString().padStart(2, "0");
        timeOptions.push(`${hourString}:${minuteString}`);
      }
    }
    return timeOptions;
  }

  const timeOptions = generateTimeOptions(15);

  useEffect(() => {
    try {
      const response = axios
        .get(`${process.env.REACT_APP_BASE_URL}/get-parking-area`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res);
          set_parkingarea(res?.data?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }

    try {
      const response = axios
        .get(`${process.env.REACT_APP_BASE_URL}/get-parking-incharge`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res);
          set_incharge(res?.data?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onSubmit = async (values) => {
    // console.log(values);

    if (!selected_incharge && !selected_area && !zip_code) {
      return toast.error("Please select location and incharge");
    } else {
      set_loading(true);
      const formdata = {
        from_date: values.from_date,
        from_time: values.from_time,
        incharge_id: selected_incharge,
        location_id: selected_area.id,
        to_date: values.to_date,
        to_time: values.to_time,
        zip_code: zip_code,
      };
      try {
        await axios
          .post(`${process.env.REACT_APP_BASE_URL}/create-schedule`, formdata, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async (res) => {
            const errordata = res?.data?.data?.error_type;
            if (errordata === "VALIDATION") {
              set_loading(false);
              const validation_error = res?.data?.data?.validation_error;
              const id = res?.data?.data?.id;
              formdata.id = id;
              set_UpdateData(formdata);
              errorhandleClickOpen();

              return null;
            } else {
              // console.log(res);
              toast.success("Parking schedule added suucessfully");
              window.location.replace("/parking/ParkingScheduling");
            }
          })
          .catch((err) => {
            set_loading(false);
            console.log(err);
          });
      } catch (error) {
        set_loading(false);
        console.log(error);
      }
    }
  };

  const handleUpdateData = async () => {
    const response = await axios
      .post(`${process.env.REACT_APP_BASE_URL}/update-schedule`, UpdateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((e) => {
        // console.log(e.data.data.status);
        if (e.data.data.status == true) {
          navigate("/ParkingScheduling");
          errorhandleClose();
        } else {
          toast.error(
            "Something Went Wrong in Updating the Schedule....Please Try again"
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Toaster />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleChange, resetForm }) => (
          <Form className="flex flex-col flex-1 gap-2">
            <div className="flex flex-1 flex-row gap-4 ">
              <div className="flex flex-1 flex-col ">
                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="location_id">
                    Location ID
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="location_id"
                    name="location_id"
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onChange={(e) => {
                      handleChange(e);
                      console.log(e.target.value);
                      const parkingArea = parkingarea.find(
                        (parking) => parking.id == e.target.value
                      );
                      set_selected_area(parkingArea);
                      set_zip_code(parkingArea?.zip_code);
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <option value="" label="Select Location" />
                    {parkingarea?.map((item) => (
                      <option key={item?.id} value={item?.id}>
                        {`${item?.address} - ${item?.station} (zip/Code: ${item?.zip_code})`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="location_id"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="zip_code">
                    Zip Code
                    <span className="text-red-500">*</span>
                  </label>
                  <div>
                    {zip_code !== "" ? (
                      <div
                        className="border border-gray-300 rounded-md px-3 py-4 mt-1  "
                        style={{ boxShadow: "0 1px 4px #fff" }}
                      >
                        {zip_code}
                      </div>
                    ) : (
                      <div
                        className="border border-gray-300 rounded-md px-3 py-4 mt-1"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                      >
                        Select Location
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="from_date">
                    From Date
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    type="date"
                    id="from_date"
                    min={new Date().toISOString().split("T")[0]}
                    name="from_date"
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />

                  <ErrorMessage
                    name="from_date"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>

                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="from_date">
                    To Date
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    type="date"
                    id="to_date"
                    name="to_date"
                    min={new Date().toISOString().split("T")[0]}
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="to_date"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col">

                <div className="flex flex-1 flex-col mt-4">
                  {/* <label htmlFor="incharge_id">
                    In-Charge Id
                    <span className="text-red-500">*</span>
                  </label> */}
                  <Autocomplete
                    sx={{
                      mt: 3.5
                    }}
                    multiple
                    id="tags-outlined"
                    options={incharge}
                    // getOptionLabel={(option) => option.first_name}
                    getOptionLabel={(option) => `${option?.first_name} (${option?.cunique_id})`}
                    // filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="In-Charge Id"
                      />
                    )}
                    onChange={(e, value) => {
                      const formattedInchargeId = value.map(item => item?.cunique_id)
                      console.log(formattedInchargeId, 'incharge')
                      set_selected_incharge(formattedInchargeId)
                    }}
                  />

                  <ErrorMessage
                    name="incharge_id"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                {/* <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="incharge_id">
                    In-Charge Id
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="incharge_id"
                    name="incharge_id"
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[30vw]"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onChange={(e) => {
                      handleChange(e);
                      const Selectedincharge = incharge.find(
                        (incharge) => incharge?.cunique_id == e.target.value
                      );
                      set_selected_incharge(Selectedincharge);
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <option value="" label="Select Location" />
                    {incharge?.map((item) => (
                      <option key={item?.cunique_id} value={item?.cunique_id}>
                        {`${item?.cunique_id} - ${item?.first_name} ${
                          item?.middle_name == null ? "" : item?.middle_name
                        } ${item?.last_name}  (Address:  ${item?.address})`}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="incharge_id"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div> */}


                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="from_time">
                    From Time
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    //type="select"
                    id="from_time"
                    name="from_time"
                    // format="HH:mm"
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[30vw]"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <option value="">-Please Select-</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="from_time"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>

                <div className="flex flex-1 flex-col mt-4">
                  <label htmlFor="to_time">
                    To Time
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    //type="select"
                    id="to_time"
                    name="to_time"
                    // format="HH:mm"
                    className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[30vw]"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <option value="">-Please Select-</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="to_time"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>

                <div className="flex flex-1 flex-row mt-5">
                  <div className="flex flex-1 justify-center items-center ">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                    >
                      <h2 className="flex text-[#4245D9] font-semibold">
                        Cancel
                      </h2>
                    </button>
                  </div>
                  <div className="flex flex-1 justify-center items-center ">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                      }}
                      className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                    >
                      <h2 className="flex text-[#4245D9] font-semibold">
                        Reset
                      </h2>
                    </button>
                  </div>
                  <div className="flex flex-1 justify-center items-center ">
                    <button
                      type="submit"
                      className="flex w-20 h-10 md:w-[80%] border bg-[#4245D9] rounded-md shadow-md justify-center items-center"
                    >
                      <h2 className="flex text-white font-semibold">
                        {loading ? "Loading..." : "Save"}
                      </h2>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

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
          {"Schedule Already Exists"}
        </DialogTitle>
        <DialogContent className="bg-red-100">
          <DialogContentText id="alert-dialog-description">
            Do You Want to Update the Parking Area Schedule
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button
            onClick={handleUpdateData}
            variant="contained"
            color="secondary"
          >
            Update
          </Button>

          <Button variant="contained" color="error" onClick={errorhandleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
