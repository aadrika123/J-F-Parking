import React from "react";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import createApiInstance from "../../../../AxiosInstance";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const cookie = Cookies.get("accesstoken");

const initialValues = {
  address: "",
  station: "",
  two_wheeler_capacity: "",
  total_parking_area: "",
  type_parking_space: "",
  zip_code: "",
  landmark: "",
  four_wheeler_capacity: "",
  agreement_doc_selected_file: null,
  two_wheeler_rate: "",
  four_wheeler_rate: "",
};

const validationSchema = Yup.object({
  address: Yup.string().required("Address Number is required"),
  station: Yup.string().required("Parking Station Name is required"),
  two_wheeler_capacity: Yup.string().required(
    "Two Wheeler Parking Capacity is required"
  ),
  total_parking_area: Yup.string().required("Total Parking Area is required"),
  type_parking_space: Yup.string().required(
    "Type of Parking Space is required"
  ),
  zip_code: Yup.string().required("Zip/Post code is required"),
  landmark: Yup.string().required("Landmark is required"),
  four_wheeler_capacity: Yup.string().required(
    "Four Wheeler Parking Capacity is required"
  ),
  agreement_doc_selected_file: Yup.mixed()
    .required("Agreement Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  two_wheeler_rate: Yup.string().notRequired("Two Wheeler Rate is required"),
  four_wheeler_rate: Yup.string().notRequired("Four Wheeler Rate is required"),
});

export default function Area_form() {
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const [imageURls, set_imageURls] = React.useState({});
  const token = localStorage.getItem("token");
  const BaseApi = createApiInstance("Base");

  const [uploading, setUploading] = React.useState({
    agreement_doc: false,
  });

  const [loading, set_loading] = React.useState(false);

  const onSubmit = async (values) => {
    set_loading(true);
    const data = {
      address: values.address,
      zip_code: values.zip_code,
      station: values.station,
      landmark: values.landmark,
      two_wheeler_capacity: values.two_wheeler_capacity,
      four_wheeler_capacity: values.four_wheeler_capacity,
      total_parking_area: values.total_parking_area,
      type_parking_space: values.type_parking_space,
      two_wheeler_rate:
        values.type_parking_space === "0" ? values.two_wheeler_rate : "0",
      four_wheeler_rate:
        values.type_parking_space === "0" ? values.four_wheeler_rate : "0",
      agreement_doc: uploadedFiles?.agreement_doc?.data[0]?.ReferenceNo,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/onboard-parking-area`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === true) {
        set_loading(false);
        toast.success("Parking area added suucessfully");
        window.location.replace("/parking/parkingArea");
        return response.data;
      } else {
        set_loading(false);
        toast.error("Failed to add parking area");
      }
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
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
    const MAX_SIZE = 2 * 1024 * 1024;

    formData.append("file", file);
    if (file.size > MAX_SIZE) {
    } else {
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
      } catch (error) {
        console.error("There was an error onboarding the parking area!", error);
      } finally {
        setUploading((prev) => ({ ...prev, [type]: false }));
      }
    }
  };
  return (
    <>
      <Toaster />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form className="flex flex-col flex-1 gap-4">
            <div className="flex flex-row mt-4">
              <div className="flex flex-1  flex-col">
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="address">
                    Address
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
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
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="station">
                    Parking Station Name
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="station"
                    name="station"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    maxLength={30}
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
                  />
                  <ErrorMessage
                    name="station"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="two_wheeler_capacity">
                    Two wheeler Parking Capacity
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="two_wheeler_capacity"
                    name="two_wheeler_capacity"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!(e.key <= "0" || e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="two_wheeler_capacity"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="total_parking_area">
                    Total Parking Area
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="total_parking_area"
                    name="total_parking_area"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!(e.key <= "0" || e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="total_parking_area"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="type_parking_space">
                    Type of Parking Space
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="type_parking_space"
                    name="type_parking_space"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    // value={locationId}
                    // onChange={(e) => setLocationID(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    <option value="0">Organised</option>
                    <option value="1">UnOrganised</option>
                  </Field>
                  <ErrorMessage
                    name="type_parking_space"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="zip_code">
                    ZIP/Postcode
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    maxLength={6}
                    onKeyPress={(e) => {
                      if (!(e.key <= "0" || e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="zip_code"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="landmark">
                    Landmark
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="landmark"
                    name="landmark"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
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
                  />
                  <ErrorMessage
                    name="landmark"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                <div className="flex flex-1 flex-col mt-4">
                  <label className="mb-2 ml-4" htmlFor="four_wheeler_capacity">
                    Four wheeler Parking Capacity
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="four_wheeler_capacity"
                    name="four_wheeler_capacity"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!(e.key <= "0" || e.key <= "9")) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="four_wheeler_capacity"
                    component="div"
                    className="text-red-500 ml-4"
                  />
                </div>
                {values.type_parking_space === "0" && (
                  <>
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="two_wheeler_rate">
                        Two wheeler Rate
                        <span className="text-red-500">*</span>
                      </label>

                      <Field
                        type="text"
                        id="two_wheeler_rate"
                        name="two_wheeler_rate"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                        maxLength={10}
                        onKeyPress={(e) => {
                          if (!(e.key <= "0" || e.key <= "9")) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <ErrorMessage
                        name="two_wheeler_rate"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>

                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="four_wheeler_rate">
                        Four wheeler Rate
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="four_wheeler_rate"
                        name="four_wheeler_rate"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                        maxLength={10}
                        onKeyPress={(e) => {
                          if (!(e.key <= "0" || e.key <= "9")) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <ErrorMessage
                        name="four_wheeler_rate"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-1 flex-col mt-4">
                  <label
                    className="mb-2 ml-4"
                    htmlFor="agreement_doc_selected_file"
                  >
                    Agreement Image
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="agreement_doc_selected_file"
                    name="agreement_doc_selected_file"
                    accept="image/*"
                    className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                    style={{ boxShadow: "0 1px 4px #fff" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 1px 4px #000")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    onChange={(event) => {
                      setFieldValue(
                        "agreement_doc_selected_file",
                        event.target.files[0]
                      );

                      handle_Image_upload(
                        event.target.files[0],
                        "agreement_doc",
                        setUploadedFiles,
                        setUploading
                      );
                    }}
                  />
                  <ErrorMessage
                    name="agreement_doc_selected_file"
                    component="div"
                    className="text-red-500 ml-4"
                  />

                  {uploadedFiles?.agreement_doc === "Error" ? (
                    <div className="text-red-500 ml-4 mt-2">
                      Error In Uploading the Agreement Certificate
                    </div>
                  ) : (
                    uploadedFiles?.agreement_doc && (
                      <div className="text-green-500 ml-4 mt-2">
                        Agreement Certificate Uploaded
                        <div>
                          <img
                            src={imageURls?.agreement_doc}
                            className="h-[50px] w-[50px]"
                          />
                        </div>
                      </div>
                    )
                  )}
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
    </>
  );
}
