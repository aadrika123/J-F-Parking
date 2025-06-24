"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function BookingModal(props) {
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: props.initialData?.address || "",
    fromDate: props.initialData?.from_date.split("T")[0] || "",
    toDate: props.initialData?.to_date.split("T")[0] || "",
    fromTime: props.initialData?.from_time || "",
    toTime: props.initialData?.to_time || "",
    firstName: props.initialData?.first_name || "",
    lastName: props.initialData?.last_name || "",
    inchargeId: props.initialData?.incharge_id || "",
  });

  // Open the modal immediately after component mounts
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleUpdateData(formData);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateData = async (data) => {
    let payload = {
      id: props.initialData?.id,
      incharge_id: [props.initialData?.incharge_id[0]],
      from_date: data?.fromDate,
      to_date: data?.toDate,
      from_time: data?.fromTime,
      to_time: data?.toTime,
    };
    const response = await axios
      .post(`${process.env.REACT_APP_BASE_URL}/update-schedule`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((e) => {
        console.log(e.data.data.status);
        if (e.data.data.status === true) {
            window.location.reload();
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

  return (
    <div>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={() => props.set_scheduling(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="fromDate">From</label>
                  <input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    value={formData.fromDate}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="toDate">To</label>
                  <input
                    id="toDate"
                    name="toDate"
                    type="date"
                    value={formData.toDate}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="fromTime">From Time</label>
                  <select
                    id="fromTime"
                    name="fromTime"
                    value={formData.fromTime}
                    onChange={handleChange}
                        disabled
                    className="border p-2 rounded"
                  >
                    <option value="">Select Time</option>
                    <option value="">-Please Select-</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="toTime">To Time</label>

                  <select
                    id="toTime"
                    name="toTime"
                    value={formData.toTime}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                  >
                    <option value="">Select Time</option>
                    <option value="">-Please Select-</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled
                    className="border p-2 rounded"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled
                    className="border p-2 rounded"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="inchargeId">Incharge Id</label>
                <input
                  id="inchargeId"
                  name="inchargeId"
                  type="text"
                  value={formData.inchargeId}
                  onChange={handleChange}
                  required
                  disabled
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="border px-4 py-2 rounded bg-[#372a7b] text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
