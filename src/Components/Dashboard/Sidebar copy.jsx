import React from "react";
import Avatar from "@mui/material/Avatar";
import sample_profile from "../../assets/sample_profile.png";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="flex w-full px-4 flex-col   rounded-r-md justify-center items-start transition-all duration-300 ease-in-out ">
      <div className="flex ">
        <div className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 mt-8 justify-center">
            <Avatar src={sample_profile} sx={{ width: 100, height: 100 }} />
          </div>
          <div className="flex flex-1 text-2xl text-[#555555] font-bold">
            RMC Admin
          </div>

          <div className="flex flex-col w-[95%] m-10 justify-start items-start overflow-auto">
            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/dashboard" ? "bg-[#5457D6] text-white" : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[100%] mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/dashboard">
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 15 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white group-hover:text-[#5457D6]"
                        >
                          <path
                            d="M13.75 12.125V5.00625C13.75 4.18 13.75 3.76625 13.535 3.44625C13.32 3.12625 12.9394 2.9725 12.1787 2.665L8.42875 1.1525C7.97 0.9675 7.74125 0.875 7.5 0.875C7.25875 0.875 7.03 0.9675 6.57125 1.1525L2.82125 2.665C2.06062 2.9725 1.68 3.12625 1.465 3.44625C1.25 3.76625 1.25 4.18 1.25 5.00625V12.125M10 10.875V12.125M5 10.875V12.125"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.6875 7.75L4.83938 7.14375C5.06625 6.23437 5.18 5.77937 5.51938 5.515C5.85813 5.25 6.32688 5.25 7.26438 5.25H7.73562C8.67312 5.25 9.14187 5.25 9.48062 5.515C9.82 5.77937 9.93375 6.23375 10.1606 7.14375L10.3125 7.75M5.3125 9.30625V9.3125M9.6875 9.30625V9.3125M10.625 7.75H4.375C4.20924 7.75 4.05027 7.81585 3.93306 7.93306C3.81585 8.05027 3.75 8.20924 3.75 8.375V10.25C3.75 10.4158 3.81585 10.5747 3.93306 10.6919C4.05027 10.8092 4.20924 10.875 4.375 10.875H10.625C10.7908 10.875 10.9497 10.8092 11.0669 10.6919C11.1842 10.5747 11.25 10.4158 11.25 10.25V8.375C11.25 8.20924 11.1842 8.05027 11.0669 7.93306C10.9497 7.81585 10.7908 7.75 10.625 7.75Z"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Dashboard
                  </div>
                </div>
              </Link>
            </div>

            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/parkingArea" ? "bg-[#5457D6] text-white" : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[100%] mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/parkingArea">
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 15 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white group-hover:text-[#5457D6]"
                        >
                          <path
                            d="M13.75 12.125V5.00625C13.75 4.18 13.75 3.76625 13.535 3.44625C13.32 3.12625 12.9394 2.9725 12.1787 2.665L8.42875 1.1525C7.97 0.9675 7.74125 0.875 7.5 0.875C7.25875 0.875 7.03 0.9675 6.57125 1.1525L2.82125 2.665C2.06062 2.9725 1.68 3.12625 1.465 3.44625C1.25 3.76625 1.25 4.18 1.25 5.00625V12.125M10 10.875V12.125M5 10.875V12.125"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.6875 7.75L4.83938 7.14375C5.06625 6.23437 5.18 5.77937 5.51938 5.515C5.85813 5.25 6.32688 5.25 7.26438 5.25H7.73562C8.67312 5.25 9.14187 5.25 9.48062 5.515C9.82 5.77937 9.93375 6.23375 10.1606 7.14375L10.3125 7.75M5.3125 9.30625V9.3125M9.6875 9.30625V9.3125M10.625 7.75H4.375C4.20924 7.75 4.05027 7.81585 3.93306 7.93306C3.81585 8.05027 3.75 8.20924 3.75 8.375V10.25C3.75 10.4158 3.81585 10.5747 3.93306 10.6919C4.05027 10.8092 4.20924 10.875 4.375 10.875H10.625C10.7908 10.875 10.9497 10.8092 11.0669 10.6919C11.1842 10.5747 11.25 10.4158 11.25 10.25V8.375C11.25 8.20924 11.1842 8.05027 11.0669 7.93306C10.9497 7.81585 10.7908 7.75 10.625 7.75Z"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Parking Area
                  </div>
                </div>
              </Link>
            </div>
            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/parkingincharge"
                  ? "bg-[#5457D6] text-white"
                  : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[100%] mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/parkingincharge">
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 13 16"
                          fill="none"
                        >
                          <path
                            d="M6.5013 14.6668C6.5013 14.6668 11.8346 10.6668 11.8346 6.3335C11.8346 3.57216 9.44697 1.3335 6.5013 1.3335C3.55564 1.3335 1.16797 3.57216 1.16797 6.3335C1.16797 10.6668 6.5013 14.6668 6.5013 14.6668Z"
                            stroke="white"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.5 4.66699V10.0003"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.5 4.66699H7.5C7.85362 4.66699 8.19276 4.80747 8.44281 5.05752C8.69286 5.30756 8.83333 5.6467 8.83333 6.00033C8.83333 6.35395 8.69286 6.69309 8.44281 6.94313C8.19276 7.19318 7.85362 7.33366 7.5 7.33366H5.5V4.66699Z"
                            stroke="white"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Parking In-charge
                  </div>
                </div>
              </Link>
            </div>
            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/ParkingScheduling"
                  ? "bg-[#5457D6] text-white"
                  : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[100%] mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/ParkingScheduling">
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 15 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white group-hover:text-[#5457D6]"
                        >
                          <path
                            d="M13.75 12.125V5.00625C13.75 4.18 13.75 3.76625 13.535 3.44625C13.32 3.12625 12.9394 2.9725 12.1787 2.665L8.42875 1.1525C7.97 0.9675 7.74125 0.875 7.5 0.875C7.25875 0.875 7.03 0.9675 6.57125 1.1525L2.82125 2.665C2.06062 2.9725 1.68 3.12625 1.465 3.44625C1.25 3.76625 1.25 4.18 1.25 5.00625V12.125M10 10.875V12.125M5 10.875V12.125"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.6875 7.75L4.83938 7.14375C5.06625 6.23437 5.18 5.77937 5.51938 5.515C5.85813 5.25 6.32688 5.25 7.26438 5.25H7.73562C8.67312 5.25 9.14187 5.25 9.48062 5.515C9.82 5.77937 9.93375 6.23375 10.1606 7.14375L10.3125 7.75M5.3125 9.30625V9.3125M9.6875 9.30625V9.3125M10.625 7.75H4.375C4.20924 7.75 4.05027 7.81585 3.93306 7.93306C3.81585 8.05027 3.75 8.20924 3.75 8.375V10.25C3.75 10.4158 3.81585 10.5747 3.93306 10.6919C4.05027 10.8092 4.20924 10.875 4.375 10.875H10.625C10.7908 10.875 10.9497 10.8092 11.0669 10.6919C11.1842 10.5747 11.25 10.4158 11.25 10.25V8.375C11.25 8.20924 11.1842 8.05027 11.0669 7.93306C10.9497 7.81585 10.7908 7.75 10.625 7.75Z"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Parking Schedule
                  </div>
                </div>
              </Link>
            </div>
            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/parkingReport"
                  ? "bg-[#5457D6] text-white"
                  : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[100%] mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/parkingReport">
                {" "}
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 13 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.15687 1.39204C9.15687 1.16323 9.24777 0.943785 9.40956 0.781989C9.57136 0.620193 9.7908 0.529297 10.0196 0.529297H11.7451C11.9739 0.529297 12.1934 0.620193 12.3552 0.781989C12.517 0.943785 12.6079 1.16323 12.6079 1.39204V3.98028C12.6079 4.20909 12.517 4.42853 12.3552 4.59033C12.1934 4.75213 11.9739 4.84302 11.7451 4.84302H11.3137V13.0391C11.3137 13.1535 11.2683 13.2632 11.1874 13.3441C11.1065 13.425 10.9968 13.4705 10.8824 13.4705C10.768 13.4705 10.6582 13.425 10.5773 13.3441C10.4964 13.2632 10.451 13.1535 10.451 13.0391V4.84302H10.0196C9.7908 4.84302 9.57136 4.75213 9.40956 4.59033C9.24777 4.42853 9.15687 4.20909 9.15687 3.98028V1.39204ZM8.50981 1.39204H3.7246C3.332 1.39201 2.95113 1.52586 2.64487 1.7715C2.33862 2.01713 2.12528 2.35986 2.04009 2.7431L1.76487 3.98028H1.39216C1.27776 3.98028 1.16804 4.02573 1.08714 4.10662C1.00624 4.18752 0.960791 4.29724 0.960791 4.41165C0.960791 4.52606 1.00624 4.63578 1.08714 4.71668C1.16804 4.79757 1.27776 4.84302 1.39216 4.84302H1.57334L1.43099 5.48361C1.1582 5.63186 0.930462 5.85097 0.771788 6.11783C0.613115 6.38469 0.529382 6.68941 0.529419 6.99989V11.3136C0.529419 11.6568 0.665763 11.986 0.908457 12.2287C1.15115 12.4714 1.48032 12.6077 1.82354 12.6077H2.25491C2.59813 12.6077 2.92729 12.4714 3.16999 12.2287C3.41268 11.986 3.54903 11.6568 3.54903 11.3136V10.8822H8.7255V11.3136C8.7254 11.6195 8.83366 11.9156 9.03108 12.1492C9.2285 12.3829 9.50231 12.5391 9.80393 12.59V11.6872C9.73835 11.6493 9.6839 11.5949 9.64604 11.5293C9.60818 11.4637 9.58824 11.3893 9.58824 11.3136V10.8822H9.80393V10.0195H1.39216V6.99989C1.39216 6.77107 1.48306 6.55163 1.64486 6.38983C1.80665 6.22804 2.02609 6.13714 2.25491 6.13714H9.80393V5.47498C9.60494 5.44624 9.4137 5.37804 9.24142 5.27439H2.36103L2.88213 2.93032C2.92471 2.73873 3.03135 2.5674 3.18444 2.44458C3.33752 2.32177 3.5279 2.25482 3.72416 2.25479H8.50981V1.39204ZM1.39216 11.3136V10.8822H2.68628V11.3136C2.68628 11.428 2.64083 11.5377 2.55994 11.6186C2.47904 11.6995 2.36932 11.745 2.25491 11.745H1.82354C1.70913 11.745 1.59941 11.6995 1.51851 11.6186C1.43761 11.5377 1.39216 11.428 1.39216 11.3136ZM4.62746 8.72538C4.62746 8.61097 4.67291 8.50125 4.7538 8.42035C4.8347 8.33945 4.94442 8.294 5.05883 8.294H7.21569C7.3301 8.294 7.43982 8.33945 7.52072 8.42035C7.60162 8.50125 7.64707 8.61097 7.64707 8.72538C7.64707 8.83978 7.60162 8.9495 7.52072 9.0304C7.43982 9.1113 7.3301 9.15675 7.21569 9.15675H5.05883C4.94442 9.15675 4.8347 9.1113 4.7538 9.0304C4.67291 8.9495 4.62746 8.83978 4.62746 8.72538ZM3.33334 8.294C3.50495 8.294 3.66953 8.22583 3.79088 8.10448C3.91223 7.98314 3.9804 7.81855 3.9804 7.64694C3.9804 7.47533 3.91223 7.31075 3.79088 7.1894C3.66953 7.06806 3.50495 6.99989 3.33334 6.99989C3.16173 6.99989 2.99715 7.06806 2.8758 7.1894C2.75445 7.31075 2.68628 7.47533 2.68628 7.64694C2.68628 7.81855 2.75445 7.98314 2.8758 8.10448C2.99715 8.22583 3.16173 8.294 3.33334 8.294ZM9.58824 7.64694C9.58824 7.81855 9.52007 7.98314 9.39872 8.10448C9.27738 8.22583 9.11279 8.294 8.94118 8.294C8.76957 8.294 8.60499 8.22583 8.48364 8.10448C8.3623 7.98314 8.29413 7.81855 8.29413 7.64694C8.29413 7.47533 8.3623 7.31075 8.48364 7.1894C8.60499 7.06806 8.76957 6.99989 8.94118 6.99989C9.11279 6.99989 9.27738 7.06806 9.39872 7.1894C9.52007 7.31075 9.58824 7.47533 9.58824 7.64694Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Parking Report
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
