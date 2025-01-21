import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import createApiInstance from "../../../../AxiosInstance";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import axios from "axios";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialValues = {
  Name: "",
  last_Name: "",
  Middle_Name: "",
  Age: "",
  Blood_Group: "",
  Fitness_Certificate_selectedFile: null,
  KYC_selectedFile: null,
  Contact_Number: "",
  Emergency_Contact_Number: "",
  EmailId: "",
  address: "",
  Zip_code: "",
};

const validationSchema = Yup.object({
  Name: Yup.string()
    //.max(3, "Minimum 3 characters")
    .min(3, "Minimum 3 characters")
    .required("Name is required"),
  Age: Yup.string()
    // .required("Age is required")
    .test(
      "is-over-18",
      "Age must be more than 18 years and less than 60 years",
      (value) => {
        const age = parseInt(value, 10); // Convert age to a number
        return age >= 18 && age < 60; // Check if age is greater than or equal to 18
      }
    ),
  Middle_Name: Yup.string().min(3, "Minimum 3 characters"),
  last_Name: Yup.string()
    //.max(3, "Minimum 3 characters")
    .min(3, "Minimum 3 characters")
    .required("Last Name is required"),
  Blood_Group: Yup.string().required("Blood Group is required"),
  Fitness_Certificate_selectedFile: Yup.mixed()
    .required("Fitness Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  KYC_selectedFile: Yup.mixed()
    .required("KYC File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Contact_Number: Yup.string()
    .required("Contact Number is required")
    .max(10, "Contact Number must be exactly 10 digits")
    .min(10, "Contact Number must be exactly 10 digits")
    .matches(/^[0-9]{10}$/, "Must be 10 digits"),
  Emergency_Contact_Number: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be 10 digits")
    .max(10, "Contact Number must be exactly 10 digits")
    .min(10, "Contact Number must be exactly 10 digits")
    .notRequired(),
  EmailId: Yup.string().email("Email is invalid").required("Email is required"),
  address: Yup.string().required("Address is required"),
  Zip_code: Yup.string().required("Zip/Post code is required"),
});

export default function Incharge_form() {
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const [imageURls, set_imageURls] = React.useState({});
  const [uploading, setUploading] = React.useState({
    KYC_selectedFile: false,
    Fitness_Certificate: false,
  });
  const [loading, set_loading] = React.useState(false);

  const ulb_id = localStorage.getItem("ulbId");

  //API Backend Registration Section
  const BaseApi = createApiInstance("Base");
  const [inChargeData, Set_inChargeData] = useState();
  const token = localStorage.getItem("token");

  const onSubmit = async (values, reset) => {
    set_loading(true);
    if (
      uploadedFiles?.KYC_File === "Error" ||
      uploadedFiles?.Fitness_Certificate === "Error"
    ) {
      set_loading(false);
      return toast.error("Error Uploading Files");
    } else {
      const formData = new FormData();

      formData.append("first_name", values.Name);
      formData.append("middle_name", values.Middle_Name);
      formData.append("last_name", values.last_Name);
      formData.append("age", values.Age);
      formData.append("blood_grp", values.Blood_Group);
      formData.append("mobile_no", values.Contact_Number);
      formData.append("emergency_mob_no", values.Emergency_Contact_Number);
      formData.append("email_id", values.EmailId);
      formData.append("address", "Ranchi Jharkhand");
      formData.append("ulb_id", ulb_id);

      formData.append("zip_code", values.Zip_code);
      formData.append("address", values.address);

      formData.append(
        "fitness_doc",
        uploadedFiles?.Fitness_Certificate?.data[0]?.ReferenceNo
      );
      formData.append("kyc_doc", uploadedFiles?.KYC_File?.data[0]?.ReferenceNo);

      try {
        const response = await BaseApi.post(
          "/onboard-parking-incharge",
          formData
        );
    
        const status = response?.data?.status;
        const errorStatus = response?.data?.error?.status;
        if (status == true) {
          set_loading(false);
          Set_inChargeData(response?.data?.data);
          setOpenDialog(true);
          setUploadedFiles({});
          reset.resetForm();
        } else if (status == 409 || errorStatus == 409) {
          set_loading(false);

          toast.error("In-Charge Already Exists");
        } else {
          set_loading(false);

          toast.error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        set_loading(false);
        console.log(error);
      }
    }
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
    const url = response.data?.data?.fullPath?.toString();
    return url;
  };

  const handle_Image_upload = async (
    file,
    type,
    setUploadedFiles,
    setUploading
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await BaseApi.post("/file-upload", formData);
      if (response?.data?.data) {
        setUploadedFiles((prev) => ({ ...prev, [type]: response.data }));
        const url = await getImage(response.data?.data[0]?.ReferenceNo);
        set_imageURls((prev) => ({ ...prev, [type]: url }));
      } else {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: "Error",
        }));
      }
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form className="flex flex-col flex-1 gap-4">
            <div className="flex flex-row mt-4 ">
              <div className="flex flex-1  flex-col ">
                <div className="flex flex-1 flex-row ">
                  <div className="flex flex-1 ">
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Name">
                        First Name
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="Name"
                        name="Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        maxLength={30}
                        onKeyPress={(e) => {
                          if (
                            !(
                              (e.key >= "a" && e.key <= "z") ||
                              (e.key >= "A" && e.key <= "Z")
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="Name"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1">
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Middle_Name">
                        Middle Name
                        {/* <span className="text-red-500">*</span> */}
                      </label>
                      <Field
                        type="text"
                        name="Middle_Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        maxLength={30}
                        onKeyPress={(e) => {
                          if (
                            !(
                              (e.key >= "a" && e.key <= "z") ||
                              (e.key >= "A" && e.key <= "Z")
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="Middle_Name"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                  </div>{" "}
                  <div className="flex flex-1 ">
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="last_Name">
                        Last Name
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="last_Name"
                        name="last_Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        maxLength={30}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="last_Name"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-row mt-4">
                  <div className="flex flex-1 flex-col mt-4">
                    <label className="mb-2 ml-4" htmlFor="Age">
                      Age
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id="Age"
                      name="Age"
                      className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                      style={{ boxShadow: "0 1px 4px #fff" }}
                      onFocus={(e) =>
                        (e.target.style.boxShadow = "0 1px 4px #000")
                      }
                      onBlur={(e) => (e.target.style.boxShadow = "none")}
                      maxLength={2}
                      onKeyPress={(e) => {
                        if (!(e.key >= "0" && e.key <= "9")) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <ErrorMessage
                      name="Age"
                      component="div"
                      className="text-red-500 ml-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col mt-4">
                    <label className="mb-2 ml-4" htmlFor="Blood_Group">
                      Blood Group
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      type="input"
                      id="Blood_Group"
                      name="Blood_Group"
                      className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                      style={{ boxShadow: "0 1px 4px #fff" }}
                      onFocus={(e) =>
                        (e.target.style.boxShadow = "0 1px 4px #000")
                      }
                      onBlur={(e) => (e.target.style.boxShadow = "none")}
                    >
                      <option className="flex flex-1" value=" ">
                        -Please Select-
                      </option>
                      <option value={"A+"}>A+</option>
                      <option value={"A-"}>A-</option>
                      <option value={"B+"}>B+</option>
                      <option value={"B-"}>B-</option>
                      <option value={"AB+"}>AB+</option>
                      <option value={"AB-"}>AB-</option>
                      <option value={"O+"}>O+</option>
                      <option value={"O-"}>O-</option>
                    </Field>
                    <ErrorMessage
                      name="Blood_Group"
                      component="div"
                      className="text-red-500 ml-4"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col mt-4">
                  <label
                    className="mb-2 ml-4"
                    htmlFor="Fitness_Certificate_selectedFile"
                  >
                    Fitness Certificate
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="Fitness_Certificate_selectedFile"
                    name="Fitness_Certificate_selectedFile"
                    accept="image/*"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    onChange={(event) => {
                      setFieldValue(
                        "Fitness_Certificate_selectedFile",
                        event.target.files[0]
                      );

                      handle_Image_upload(
                        event.target.files[0],
                        "Fitness_Certificate",
                        setUploadedFiles,
                        setUploading
                      );
                    }}
                  />
                  <ErrorMessage
                    name="Fitness_Certificate_selectedFile"
                    component="div"
                    className="text-red-500 ml-4"
                  />

                  {uploadedFiles?.Fitness_Certificate === "Error" ? (
                    <div className="text-red-500 ml-4 mt-2">
                      Error In Uploading the Fitness Certificate
                    </div>
                  ) : (
                    uploadedFiles?.Fitness_Certificate && (
                      <div className="text-green-500 ml-4 mt-2">
                        Fitness Doc Uploaded
                        <div>
                          <img
                            src={imageURls?.Fitness_Certificate}
                            className="h-[50px] w-[50px]"
                            alt="Fitness Certificate"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="KYC_selectedFile">
                    KYC Doc
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="KYC_selectedFile"
                    name="KYC_selectedFile"
                    accept="image/*"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    onChange={(event) => {
                      setFieldValue("KYC_selectedFile", event.target.files[0]);

                      handle_Image_upload(
                        event.target.files[0],
                        "KYC_File",
                        setUploadedFiles,
                        setUploading
                      );
                    }}
                  />
                  <ErrorMessage
                    name="KYC_selectedFile"
                    component="div"
                    className="text-red-500 ml-4"
                  />

                  {uploadedFiles?.KYC_File === "Error" ? (
                    <div className="text-red-500 ml-4 mt-2">
                      Error In Uploading the KYC Certificate
                    </div>
                  ) : (
                    uploadedFiles?.KYC_File && (
                      <div className="text-green-500 ml-4 mt-2">
                        KYC Doc Uploaded
                        <div>
                          <img
                            src={imageURls?.KYC_File}
                            className="h-[50px] w-[50px]"
                            alt="KYC Document"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-1  flex-col">
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="Contact_Number">
                    Contact Number
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="Contact_Number"
                    name="Contact_Number"
                    placeholder="+91 "
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!(e.key >= "0" && e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="Contact_Number"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="address">
                    Address
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    maxLength={100}
                    onKeyPress={(e) => {
                      if (
                        !(
                          e.key <= "a" ||
                          e.key <= "z" ||
                          e.key <= "A" ||
                          e.key <= "Z" ||
                          (e.key = "")
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="Contact_Number">
                    Zip/Post Code
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="Zip_code"
                    name="Zip_code"
                    placeholder="Enter your zipcode"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    maxLength={6}
                    onKeyPress={(e) => {
                      if (!(e.key >= "0" && e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="Zip_code"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label
                    className="mb-2 ml-4"
                    htmlFor="Emergency_Contact_Number"
                  >
                    Emergency Contact Number
                  </label>
                  <Field
                    type="text"
                    id="Emergency_Contact_Number"
                    name="Emergency_Contact_Number"
                    placeholder="+91 "
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (
                        !(e.key >= "0" && e.key <= "9") ||
                        (e.key >= "a" && e.key <= "z") ||
                        (e.key >= "A" && e.key <= "Z")
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="Emergency_Contact_Number"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="EmailId">
                    Email Id
                  </label>
                  <Field
                    type="email"
                    id="EmailId"
                    name="EmailId"
                    placeholder="sample_email@gmail.com"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    maxLength={80}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <ErrorMessage
                    name="EmailId"
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
                        setUploadedFiles({});
                        window.location.reload();
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          {/* <p>Your form has been submitted successfully.</p> */}
          <div className="flex flex-1 flex-col justify-center items-center">
            <div className="flex rounded-full bg-[#4338CA] h-20 w-20 justify-center items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.39648 10.8436L7.70685 15.154L16.3276 5.91748"
                  stroke="white"
                  stroke-width="1.39091"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Congratulation!!</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex text-black font-semibold">
                Your Parking In-Charge ID :
              </div>
              <div className="flex ml-2 text-[#4A4545]">
                {inChargeData?.cunique_id}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
