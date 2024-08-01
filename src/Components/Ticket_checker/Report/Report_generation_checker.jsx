import React, { useState } from "react";
import RMC_logo from "../../../assets/RMC_LOGO.png";
import bus from "../../../assets/icons/Parking/Images/bus.png";
import { useNavigate } from "react-router-dom";
import background_image from "../../../assets/background_image.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const initialValues = {
  daily_collection: "",
  monthly_collection: "",
};

const validationSchema = Yup.object().shape({
  daily_collection: Yup.string().test(
    "daily-or-monthly",
    "Either Daily Collection or Monthly Collection is required",
    function (value) {
      const { monthly_collection } = this.parent;
      return value || monthly_collection;
    }
  ),
  monthly_collection: Yup.string().test(
    "monthly-or-daily",
    "Either Daily Collection or Monthly Collection is required",
    function (value) {
      const { daily_collection } = this.parent;
      return value || daily_collection;
    }
  ),
});

export default function Report_generation_checker() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, set_loading] = useState(false);
  const InchargeId = localStorage.getItem("InchargeId");

  const onSubmit = (values, reset) => {
    console.log("Form data", values);
    set_loading(true);
    const data = values.daily_collection
      ? { incharge_id: InchargeId, date: values.daily_collection }
      : {
          incharge_id: InchargeId,
          month: values.monthly_collection.split("-")[1],
          year: values.monthly_collection.split("-")[0],
        };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/incharge-daywise`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        set_loading(false);
        console.log("Response", res);
        console.log("Response Data", res.data.data?.data);
        if (res.data.data?.data) {
          navigate("/Incharge_Report", { state: res.data.data?.data[0] });
        } else if (res.data?.error) {
          toast.error(res.data?.error);
          reset.resetForm();
          return null;
        }
      })
      .catch((err) => {
        console.log(err);
        set_loading(false);
      });
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-between h-screen w-screen">
        <div className="flex flex-1 flex-col justify-between bg-white h-screen">
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
                d="M54 15.1515L45.8098 8 0 48l45.8098 40L54 80.8485 16.3805 48 54 15.1515Z"
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
                    <div className="flex mt-5">
                      <h2
                        style={{ fontWeight: 500, fontSize: 20 }}
                        className="text-[#585858]"
                      >
                        Ranchi Municipal Corporation
                      </h2>
                    </div>
                    <div className="flex mt-2 flex-row">
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

          <div className="relative w-full flex-col overflow-y-auto">
            <div className="flex flex-col w-full h-fit justify-center">
              <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col w-full justify-center items-center">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ isSubmitting, values, setFieldValue }) => (
                      <Form className="flex w-full flex-col flex-1 m-4">
                        <div className="flex flex-1 flex-col m-2">
                          <label
                            className="mb-1 ml-4"
                            htmlFor="daily_collection"
                          >
                            Daily Collection
                          </label>
                          <Field
                            type="date"
                            id="daily_collection"
                            name="daily_collection"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-full"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            disabled={values.monthly_collection !== ""}
                            onChange={(e) => {
                              setFieldValue("daily_collection", e.target.value);
                              setFieldValue("monthly_collection", "");
                            }}
                          />
                          <ErrorMessage
                            name="daily_collection"
                            component="div"
                            className="text-red-500 text-sm ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col m-2">
                          <label
                            className="mb-1 ml-4"
                            htmlFor="monthly_collection"
                          >
                            Monthly Collection
                          </label>
                          <Field
                            type="month"
                            id="monthly_collection"
                            name="monthly_collection"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-full"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            disabled={values.daily_collection !== ""}
                            onChange={(e) => {
                              setFieldValue(
                                "monthly_collection",
                                e.target.value
                              );
                              setFieldValue("daily_collection", "");
                            }}
                          />
                          <ErrorMessage
                            name="monthly_collection"
                            component="div"
                            className="text-red-500 text-sm ml-4"
                          />
                        </div>
                        <div className="flex justify-center mt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex m-4 flex-row w-[90%] text-lg md:text-xl lg:text-2xl xl:text-3xl border-2 border-[#4338CA] hover:bg-[#4338CA] hover:text-white text-black font-md p-2 rounded-md justify-center items-center`}
                          >
                            {loading ? "Loading..." : "Generate Report"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
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
    </>
  );
}
