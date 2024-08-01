import React, { useState } from "react";
import RMC_logo from "../../assets/icons/Parking/Images/RMC_LOGO.png";
import bus from "../../assets/icons/Parking/Images/bus.png";
import { useNavigate } from "react-router-dom";
import background_image from "../../assets/background_image.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Unorganised_ticket_check({
  type_parking_space,
  area_id,
}) {
  const navigate = useNavigate();
  const InchargeId = localStorage.getItem("InchargeId");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    vehicle_type: "",
    vehicle_no: "",
    in_time: "",
    out_time: "",
    amount: "",
  };

  const validationSchema = Yup.object({
    vehicle_type: Yup.string().required("Vehicle type is Required"),
    vehicle_no: Yup.string().required("Required"),
    in_time: Yup.string().required("Required"),
    out_time: Yup.string().required("Required"),
    amount: Yup.number().required("Required"),
  });

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

  const printTextData = (data) => {
    const date = moment(data?.created_at).format("DD-MM-YYYY");
    // const time = moment(data?.date).format('hh:mm'); am pm formate
    const time = moment(data?.created_at).format("HH:mm");
    const printTxt =
      "[C]" +
      "Ranchi Municipal Corporation" +
      "\n" +
      "[C]" +
      "Parking" +
      "\n \n" +
      "Parking Location: " +
      data?.parking_location +
      "\n \n" +
      "Date: " +
      date +
      "\n \n" +
      "In-Time: " +
      data?.in_time +
      "\n \n" +
      "Out-Time :" +
      data?.out_time +
      "\n \n" +
      "Amount: " +
      data?.amount +
      " /-" +
      "\n \n" +
      "Vehicle No: " +
      data?.vehicle_no +
      "\n \n" +
      "Incharge ID: " +
      data?.incharge_id +
      "\n \n" +
      "Receipt: " +
      data?.receipt_no +
      "\n" +
      "\n \n" +
      "Thank You for using our service!" +
      "\n" +
      "\n \n" +
      "*******************************";

    return printTxt;
  };

  const printToBTPrinter = (data) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          Key: "PRINT_FOR_BT_PRINTER",
          keyData: {
            charPerLine: 32,
            printTxt: printTextData(data),
          },
        })
      );
    }
  };

  const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    const response = await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/receipt-create`,
        {
          vehicle_type: values.vehicle_type == "Two_Wheeler" ? 0 : 1,
          vehicle_no: values.vehicle_no,
          in_time: values.in_time,
          out_time: values.out_time,
          amount: values.amount,
          type_parking_space: type_parking_space == "UnOrganized" ? 1 : 0,
          incharge_id: InchargeId,
          area_id: area_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        toast.success(
          "Ticket generated successfully of amount:",
          values.amount
        );
        console.log(res.data?.data);
        const res_data = res.data?.data;
        const Address =
          res_data?.area?.address +
          " " +
          res_data?.area?.landmark +
          " " +
          res_data?.area?.station;

        console.log(Address);
        const data = {
          parking_location: Address,
          in_time: res_data?.in_time,
          out_time: res_data?.out_time,
          amount: res_data?.amount,
          vehicle_no: res_data?.vehicle_no,
          incharge_id: InchargeId,
          receipt_no: res_data?.receipt_no,
          created_at: new Date(res_data?.date),
        };
        console.log(data);
        printToBTPrinter(data);
        window.alert(
          `Ticket generated successfully of amount: ${res_data.amount}`
        );
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-between h-screen w-screen">
      <div className="flex flex-1 flex-col justify-between bg-white h-screen ">
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
              d="M54 15.1515L45.8098 8L0 48L45.8098 88L54 80.8485L16.3805 48L54 15.1515Z"
              fill="#414141"
            />
          </svg>
        </div>
        <div className="flex h-[250px] md:h-[100px] pb-8  justify-center items-center md:justify-start rounded-b-[30px] border-b-[3px] border-l-0 border-r-0 shadow-md border-t-0">
          <div className="flex flex-1 flex-col md:flex-row  justify-between  items-center">
            <div className="flex  flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row">
                <div className="flex mt-8 justify-center items-center">
                  <img
                    src={RMC_logo}
                    alt="RMC Logo"
                    className=" flex max-w-full mt-5 ml-5 mr-5 h-auto md:h-1/2"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex mt-5 ">
                    <h2
                      style={{ fontWeight: 500, fontSize: 20 }}
                      className="text-[#585858]"
                    >
                      Ranchi Municipal Corporation
                    </h2>
                  </div>
                  <div className="flex mt-2 flex-row ">
                    <h1 className="text-md font-bold break-words text-[#1436C3]">
                      Parking Management System
                    </h1>
                    <img
                      src={bus}
                      alt="Bus"
                      className="ml-2 max-w-full h-full  md:h-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full flex-col overflow-y-auto">
          <div className="flex flex-col w-full h-fit justify-center ">
            <div className="flex flex-1 justify-center items-center">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="flex flex-col flex-1">
                    <div className="flex flex-1 flex-row m-4 justify-center items-center gap-8">
                      <div className="flex">
                        <Field
                          id="Two_Wheeler"
                          type="radio"
                          name="vehicle_type"
                          value="Two_Wheeler"
                        />
                        <label htmlFor="Two_Wheeler">Two Wheeler</label>
                      </div>
                      <div className="flex">
                        <Field
                          id="Four_Wheeler"
                          type="radio"
                          name="vehicle_type"
                          value="Four_Wheeler"
                        />
                        <label htmlFor="Four_Wheeler">Four Wheeler</label>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center items-center">
                      <ErrorMessage
                        name="vehicle_type"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                    <div className="flex flex-1 flex-col m-2">
                      <label className="mb-2 ml-4" htmlFor="vehicle_no">
                        Vehicle Number
                      </label>
                      <Field
                        type="text"
                        id="vehicle_no"
                        name="vehicle_no"
                        placeholder="Vehicle Number"
                        className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-full"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="vehicle_no"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>

                    <div className="flex flex-1 flex-row m-2 ">
                      <div className="flex flex-1 ">
                        <div className="flex flex-1 flex-col  m-2">
                          <label htmlFor="in_time">In Time </label>
                          <Field
                            as="select"
                            id="in_time"
                            name="in_time"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-auto"
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
                            name="in_time"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div className="flex flex-1 flex-col m-2">
                          <label htmlFor="out_time">Out Time </label>
                          <Field
                            as="select"
                            id="out_time"
                            name="out_time"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-auto"
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
                            name="out_time"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col m-2">
                      <label className="mb-2 ml-4" htmlFor="amount">
                        Total Amount
                      </label>
                      <Field
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="10.00/-"
                        className="border border-gray-300 rounded-md px-3 py-4  w-full"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex m-4 flex-row w-[90%] text-lg md:text-xl lg:text-2xl xl:text-3xl border-2 border-[#4338CA] hover:bg-[#4338CA] hover:text-white text-black font-md p-2 rounded-md justify-center items-center`}
                    >
                      {loading ? "Loading..." : "Book Ticket"}
                    </button>
                  </Form>
                )}
              </Formik>
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
  );
}
