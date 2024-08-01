import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import parkingStop from "../../assets/parking-stop.png";
import icon from "../../assets/two 1.jpg";
import car from "../../assets/car 1.jpg";
import axios from "axios";

export default function ParkingReport() {
  const navigate = useNavigate();
  // const date = new Date().toLocaleDateString();

  const newDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    newDate
  );
  const [data, setData] = useState();
  const [location, setLocation] = useState();
  const [locationId, setLocationID] = useState();

  const [incharge, set_incharge] = useState();
  const [totalVechicle, set_totalVechicle] = useState(0);
  const [totalVechiclePrice, set_totalVechiclePrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const [selected_incharge, set_selected_incharge] = useState();

  const [two_wheeler,set_two_wheeler] =useState(0)
  const [four_wheeler,set_four_wheeler] = useState(0)

  const [two_wheeler_price,set_two_wheeler_price] = useState(0)
  const [four_wheeler_price,set_four_wheeler_price] =useState(0)
  const token = localStorage.getItem("token");

  const fetchData = async (values, resetForm) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/collection`,
        {
          area_id: locationId || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response?.data?.data);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/get-all-parking-area`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocation(response?.data?.data);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  console.log("selected Incharge",selected_incharge)

  const fetchIncharge = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BASE_URL}/get-parking-incharge`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          set_incharge(res.data?.data?.data);
        });
    } catch (error) {
      console.log("There was an error on geting the Incharge!", error);
    }
  };

  console.log(incharge);
  console.log(location);

/*   useEffect(() => {
    fetchData();
  }, [locationId]);
 */
  useEffect(() => {
    fetchLocation();
    fetchIncharge();
  }, []);

  const SetTotal_Vechicle = () => {
    var twoWheelerCount = 0
    var fourWheelerCount = 0;

    data?.four_wheeler?.forEach(item => {
        fourWheelerCount += item.count;
    });
    data?.two_wheeler?.forEach(item=>{
      twoWheelerCount += item.count;
    })
    
    var twoWheelerSum =  0;
    var fourWheelerSum =  0;
   
    data?.two_wheeler?.forEach(item =>{
      twoWheelerSum +=item.sum
    })
    data?.four_wheeler?.forEach(item =>{
      fourWheelerSum +=item.sum 
    })

    set_two_wheeler(twoWheelerCount)
    set_four_wheeler(fourWheelerCount)
    set_two_wheeler_price(twoWheelerSum)
    set_four_wheeler_price(fourWheelerSum)
    const totalVehiclePrice = twoWheelerSum + fourWheelerSum;
    const totalVehicle = twoWheelerCount + fourWheelerCount;
    set_totalVechicle(totalVehicle);
    set_totalVechiclePrice(totalVehiclePrice);
  };

  useEffect(() => {
    SetTotal_Vechicle();
  }, [locationId, data]);

 useEffect(()=>{
  setData()
 },[selectedOption])


  function getPastDate(years) {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - years);
  
    const year = pastDate.getFullYear();
    let month = pastDate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = pastDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  }
  
  // Function to get future date in YYYY-MM-DD format, given number of years
  function getFutureDate(years) {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + years);
  
    const year = futureDate.getFullYear();
    let month = futureDate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = futureDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  }

const handleSubmit = (values) =>{
  console.log("Form Data",values)
  if(values.selection === "areaId"){
      handleSearchArea(values.location,values.fromDate,values.toDate)
  }else if(values.selection === 'inChargeId' ){
    handleSearchIncharge(values.inChargeId,values.fromDate,values.toDate)
  }

}


const handleSearchIncharge = async (incharge,fromDate,toDate) =>{
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/report/collection`,
      {
        incharge_id: incharge ,
        from_date:fromDate,
        to_date:toDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response?.data?.data);
  } catch (error) {
    console.error("There was an error onboarding the parking area!", error);
  }
  
}
const handleSearchArea = async(locationID,fromDate,toDate) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/report/collection`,
      {
        area_id: locationID ,
        from_date:fromDate,
        to_date:toDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response?.data?.data);
  } catch (error) {
    console.error("There was an error onboarding the parking area!", error);
  }
}

console.log("data from the server >>> ",data)
  return (
    <>
      <div className="flex flex-1 overflow-scroll ">
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center mt-5 p-4">
            <div className="flex ml-4 ">
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="flex flex-row cursor-pointer"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3837_9887)">
                    <path
                      d="M10.6736 7.20512L4 13.9135L10.6736 20.6218C10.7339 20.7009 10.8105 20.7662 10.8981 20.8132C10.9858 20.8602 11.0826 20.8878 11.1819 20.8941C11.2812 20.9004 11.3806 20.8854 11.4736 20.8499C11.5666 20.8144 11.6508 20.7594 11.7206 20.6886C11.7905 20.6177 11.8443 20.5327 11.8784 20.4393C11.9125 20.3458 11.9262 20.2461 11.9184 20.147C11.9107 20.0478 11.8817 19.9514 11.8335 19.8644C11.7853 19.7774 11.7189 19.7018 11.6389 19.6426L6.64583 14.6079H19.9306C20.1147 14.6079 20.2914 14.5347 20.4216 14.4045C20.5518 14.2743 20.625 14.0976 20.625 13.9135C20.625 13.7293 20.5518 13.5526 20.4216 13.4224C20.2914 13.2922 20.1147 13.219 19.9306 13.219H6.64583L11.6389 8.18429C11.7687 8.05352 11.8413 7.87653 11.8407 7.69225C11.84 7.50797 11.7662 7.33149 11.6354 7.20165C11.5047 7.0718 11.3277 6.99922 11.1434 6.99987C10.9591 7.00052 10.7826 7.07435 10.6528 7.20512H10.6736Z"
                      fill="#665DD9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3837_9887">
                      <rect
                        width="25"
                        height="25"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 25)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="ml-2 mt-1 text-[#665DD9]  text-sm text-center">
                  {" "}
                  Back
                </div>
              </div>
            </div>
            <div className="flex text-xl font-semibold  mr-4">
              Parking Report
            </div>
          </div>

          <div className="flex h-fit bg-white border-2 shadow-md mt-4 ml-4 mr-4 mb-2 p-8">
            <div className="flex flex-row flex-1 m-1">
              <div className="flex  justify-center items-center">
                <img
                  className="h-[60px] w-[60px]"
                  src={parkingStop}
                  alt="img"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center items-start ml-4">
                <div className="flex flex-1 font-semibold mb-2 ">
                  Search Filter
                </div>
                <div className="flex flex-1 w-full ">
                  <Formik
                    initialValues={{
                      location: "",
                      inChargeId: "",
                      areaId: "",
                      fromDate: "",
                      toDate: "",
                      selection:""
                    }}
                    onSubmit={(values,reset) => {
                      console.log(values);
                      handleSubmit(values)
                    }}
                  >
                    {({ values, handleChange ,setFieldValue}) => (
                      <Form className="w-full flex flex-1 flex-row">
                        <div className="flex flex-1 flex-col"> 
                        <div className="flex flex-row">
                          <div className="flex  mr-2">
                            <label>
                              <Field
                                type="radio"
                                name="selection"
                                value="areaId"
                                className="ml-2 mr-2 cursor-pointer"
                                checked={selectedOption === "areaId"}
                                onChange={() => {
                                  setFieldValue('selection',"areaId")
                                  setSelectedOption("areaId")}}
                              />
                              By Location 
                            </label>
                          </div>
                          <div className="flex  mr-2">
                            <label>
                              <Field
                                type="radio"
                                name="selection"
                                value="inChargeId"
                                className="ml-2 mr-2 cursor-pointer"
                                checked={selectedOption === "inChargeId"}
                                onChange={() => {
                                  setFieldValue('selection',"inChargeId")
                                  setSelectedOption("inChargeId")}}
                              />
                              By InCharge 
                            </label>
                          </div>
                        </div>

                        {selectedOption === "areaId" && (
                          <div className="flex flex-row">
                            <div className="flex flex-1 mr-2">
                              <Field
                                as="select"
                                name="location"
                                className="border-2 rounded p-2 m-4"
                                value={locationId}
                                onChange={(e) => {
                                  setFieldValue('location',e.target.value)
                                  setLocationID(e.target.value)}}
                              >
                                <option value={null}>Select Location</option>
                                {location?.data?.map((loc) => (
                                  <option key={loc?.id} value={loc?.id}>
                                    {loc?.address} - {loc?.station}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <div className="flex flex-1 flex-col ml-2 mr-2 mb-4 ">
                              <label>From Date:</label>
                              <Field
                                type="date"
                                name="fromDate"
                                className="border-2 rounded p-2 w-full"
                                value={values.fromDate}
                                onChange={handleChange}
                                min={getPastDate(10)} 
                                max={getFutureDate(40)}  

                                onKeyPress={(e) => {
                                  if (
                                    (
                                      (e.key >= "a" && e.key <= "z") ||
                                      (e.key >= "A" && e.key <= "Z") ||
                                      (e.key >= "0" && e.key <= "9")
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              ></Field>
                            </div>
                            <div className="flex flex-1 flex-col ml-2 mr-2 mb-4">
                              <label>To Date:</label>
                              <Field
                                type="date"
                                name="toDate"
                                className="border-2 rounded p-2 w-full"
                                value={values.toDate}
                                onChange={handleChange}
                                min={getPastDate(10)} 
                                max={getFutureDate(40)} 
                                onKeyPress={(e) => {
                                  if (
                                    (
                                      (e.key >= "a" && e.key <= "z") ||
                                      (e.key >= "A" && e.key <= "Z") ||
                                      (e.key >= "0" && e.key <= "9")
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              ></Field>
                            </div>
                            <button type="submit"  className="flex p-4 ml-2 mr-2 mb-4 mt-4 shadow-md rounded-md bg-[#665DD9] text-white font-bold flex-1 justify-center items-center">
                            <svg className="ml-2 mr-2" fill="white " height="20px" width="20px" version="1.1" id="Capa_1" 
                                  viewBox="0 0 488.4 488.4" >
                                <g>
                                  <g>
                                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
                                      s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
                                      S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
                                      S381.9,104.65,381.9,203.25z"/>
                                  </g>
                                </g>
                                </svg>
                              Search 
                            </button>
                          </div>
                        )}

                        {selectedOption === "inChargeId" && (
                          <div className="flex flex-row ">
                            <Field
                              name="inChargeId"
                              as="select"
                              value={selected_incharge}
                              onChange= {(e)=>{
                                setFieldValue('inChargeId',e.target.value)
                                set_selected_incharge(e.target.value)}}
                              placeholder="InCharge ID"
                              className="border-2 rounded p-2 m-4"
                            >
                              <option value="" label="Select Incharge" />
                              {incharge?.map((item) => (
                                <option
                                  key={item?.cunique_id}
                                  value={item?.cunique_id}
                                >
                                  {`${item?.cunique_id} - ${item?.first_name} ${
                                    item?.middle_name == null
                                      ? ""
                                      : item?.middle_name
                                  } ${item?.last_name}  (Address:  ${
                                    item?.address
                                  })`}
                                </option>
                              ))}
                            </Field>
                            <div className="flex flex-col flex-1 ml-2 mr-2 mb-4">
                              <label>From Date:</label>
                              <input
                                type="date"
                                name="fromDate"
                                className="border-2 rounded p-2 w-full"
                                value={values.fromDate}
                                min={getPastDate(10)} 
                                max={getFutureDate(40)}  
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  if (
                                    (
                                      (e.key >= "a" && e.key <= "z") ||
                                      (e.key >= "A" && e.key <= "Z") ||
                                      (e.key >= "0" && e.key <= "9")
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                            <div className="flex flex-1 flex-col ml-2 mr-2 mb-4">
                              <label>To Date:</label>
                              <input
                                type="date"
                                name="toDate"
                                className="border-2 rounded p-2 w-full"
                                value={values.toDate}
                                onChange={handleChange}
                                min={getPastDate(10)} 
                                max={getFutureDate(40)}  
                                onKeyPress={(e) => {
                                  if (
                                    (
                                      (e.key >= "a" && e.key <= "z") ||
                                      (e.key >= "A" && e.key <= "Z") ||
                                      (e.key >= "0" && e.key <= "9") 
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                            <button type="submit" className="flex p-4 ml-2 mr-2 mb-4 mt-4 shadow-md rounded-md bg-[#665DD9] text-white font-bold flex-1 justify-center items-center">
                            <svg className="ml-2 mr-2" fill="white " height="20px" width="20px" version="1.1" id="Capa_1" 
                                  viewBox="0 0 488.4 488.4" >
                                <g>
                                  <g>
                                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
                                      s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
                                      S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
                                      S381.9,104.65,381.9,203.25z"/>
                                  </g>
                                </g>
                                </svg>
                              Search 
                            </button>
                          </div>
                        )}
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-y-scroll">
            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 shadow-xl rounded-md  bg-white m-2">
                <div className="flex flex-row w-full h-[50px] justify-between p-5">
                  <div>
                    <h5 className="p-1 m-2">
                      <span className="font-semibold">Parking Type: </span>
                      {data?.location_info[0]?.type_parking_space && (
                        <span
                          className={`${
                            data?.location_info[0]?.type_parking_space ===
                            "Organized"
                              ? "text-gray-500 bg-[#B9FFDD] p-2 ml-2 rounded-full"
                              : "text-gray-500 bg-[#FAF691] p-2 ml-2 rounded-full"
                          }`}
                        >
                          {data?.location_info[0]?.type_parking_space}
                        </span>
                      )}
                    </h5>
                    <h5 className="p-1 m-2">
                      <span className="font-semibold"> Parking Name: </span>{" "}
                      <span className="ml-2 text-md font-bold text-[#1436C3] mr-2">
                        {data?.location_info[0]?.address} -
                      </span>
                      <span>{data?.location_info[0]?.station}</span>
                    </h5>
                    <h5 className="p-1 m-2">
                      <span className="font-semibold">Land Mark: </span>{" "}
                      <span className="ml-2 text-md font-bold text-[#1436C3]">
                        {data?.location_info[0]?.landmark}{" "}
                      </span>
                    </h5>
                    <h5 className="p-1 m-2">
                      <span className="font-semibold"> Pin Code: </span>{" "}
                      <span className="ml-2 text-md font-bold text-[#1436C3]">
                        {data?.location_info[0]?.zip_code}{" "}
                      </span>
                    </h5>
                    <h5 className="p-1 flex-row flex m-2">
                      <span className="font-semibold">Parking Capacity: </span>

                      {(data?.location_info[0]?.two_wheeler_capacity ||
                        data?.location_info[0]?.two_wheeler_capacity) && (
                        <span className="flex flex-row gap-4 ml-4">
                          <div className="flex flex-row gap-2 justify-center items-center">
                            <div className="flex flex-row gap-2 justify-center items-center text-md font-bold">
                              <div className="flex">
                                <div
                                  className="flex justify-center items-center h-[20px] w-[20px] rounded-full "
                                  style={{
                                    backgroundColor: "rgba(4, 145, 35, 0.2)",
                                  }}
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
                              </div>
                              <div className="flex ">
                                {data?.location_info[0]?.two_wheeler_capacity}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row  gap-2 justify-center items-center">
                            <div className="flex">
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
                            </div>
                            <div className="flex font-bold  ">
                              {data?.location_info[0]?.four_wheeler_capacity}
                            </div>
                          </div>
                        </span>
                      )}
                    </h5>
                    <h5 className="p-1 m-2">
                      <span className="font-semibold">In-charge Name :</span>
                      <div className="flex grid-cols-3 gap-2 mt-2 ">
                        <div className="flex flex-col shadow-lg p-4 justify-between items-center border-2">
                          <img
                            className="h-[20px] w-[20px]"
                            src={parkingStop}
                            alt="img"
                          />
                          <p>
                            {data?.incharge[0]?.first_name}{" "}
                            {data?.incharge[0]?.last_name}
                          </p>
                          <span className="text-xs">
                            Total Collection - {data?.incharge[0]?.sum}/-
                          </span>
                        </div>
                      </div>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-[400px] flex-1  justify-start items-center border-2 shadow-xl rounded-md bg-white m-2">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">Collection Report</div>
                  </div>
                  <div className="flex flex-1 mr-2 justify-end items-center">
                    <div className="flex flex-row justify-center items-center gap-2">
                      <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                        <svg
                          width="13"
                          height="12"
                          viewBox="0 0 13 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.19885 4.32198H11.6973M9.36428 6.65577L3.53183 6.65495M5.47596 8.98822L3.53183 8.98793M3.53183 0.82251V1.989M9.36428 0.82251V1.989M3.06523 11.3209H9.83087C10.4842 11.3209 10.8108 11.3209 11.0604 11.1938C11.2798 11.082 11.4583 10.9035 11.5701 10.684C11.6973 10.4345 11.6973 10.1078 11.6973 9.45453V3.85538C11.6973 3.20208 11.6973 2.87544 11.5701 2.62591C11.4583 2.40642 11.2798 2.22797 11.0604 2.11614C10.8108 1.989 10.4842 1.989 9.83087 1.989H3.06523C2.41194 1.989 2.08529 1.989 1.83577 2.11614C1.61627 2.22797 1.43783 2.40642 1.32599 2.62591C1.19885 2.87544 1.19885 3.20208 1.19885 3.85538V9.45453C1.19885 10.1078 1.19885 10.4345 1.32599 10.684C1.43783 10.9035 1.61627 11.082 1.83577 11.1938C2.08529 11.3209 2.41194 11.3209 3.06523 11.3209Z"
                            stroke="white"
                            stroke-width="0.627163"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex font-semibold">
                        <h3> {formattedDate} </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div className="border-r-2	">
                      <p className="text-4xl font-bold text-green-500">
                        {totalVechicle}
                      </p>
                      <p className="w-40">Total No. of Vehicle Count</p>
                    </div>

                    <div>
                      <p className="text-4xl font-bold text-green-500">
                        {totalVechiclePrice} /-
                      </p>
                      <p className="w-40">Total Amount of Vehicle Collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-col h-[200px] flex-1  justify-start items-center border-2 shadow-xl rounded-md bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">Two Wheeler</div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div className="border-r-2">
                      <p className="text-4xl font-bold text-green-500">
                        {two_wheeler}
                      </p>
                      <p className="w-40">Total No. of Vehicle Count</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-green-500">
                        {two_wheeler_price} /-
                      </p>
                      <p className="w-40">Total Amount of Vehicle Collection</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-2">
                  <img className="h-[100px] w-[100px]" src={icon} alt="img" />
                </div>
              </div>

              <div className="flex flex-col h-[200px] flex-1  justify-start items-center border-2 shadow-xl rounded-md bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">Four Wheeler</div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div className="border-r-2">
                      <p className="text-4xl font-bold text-green-500">
                        {four_wheeler}{" "}
                      </p>
                      <p className="w-40">Total No. of Vehicle Count</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-green-500">
                        {four_wheeler_price} /-
                      </p>
                      <p className="w-40">Total Amount of Vehicle Collection</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-2">
                  <img className="h-[100px] w-[100px]" src={car} alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
