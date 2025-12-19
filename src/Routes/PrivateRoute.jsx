import React, { useState } from "react";
import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Dashboard/Sidebar";
import { motion } from "framer-motion";
import NewHeader from "../Components/Header/NewHeader";

const PrivateRoute = ({ Element }) => {
  //const token = Cookies.get("accesstoken");
  const token = localStorage.getItem("token");
  const [hide, setHide] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Event listener to detect window resize
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarVariants = {
    visible: { x: 0 },
    hidden: { x: -400 },
  };

  return token ? (
    <>
      {isMobile ? (
        <div className="fixed inset-0 flex items-center justify-center bg-[#665DD9]  text-white text-center p-4">
          <div>
            <h1 className="text-2xl font-bold">Not Supported</h1>
            <p className="mt-2">
              This website is not optimized for mobile phones. Please open it on
              a desktop.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col h-[100vh]">
          <div className="flex  h-fit w-full">
            {/* <Header
              hide={hide}
              set_hide={setHide}
              heading={"Parking Management System"}
            /> */}
            <NewHeader
              hide={hide}
              set_hide={setHide}
              heading={"Parking Management System"}
            />

          </div>

          <div className="flex flex-1 flex-row overflow-hidden">
            <div className="flex  w-fit ">
              <div className="flex flex-1 ">
                <motion.div
                  className={`${hide ? "hidden" : "flex"
                    }  transition-all duration-300 ease-in-out  w-full`}
                  initial={{ x: -400 }} // Initial animation for hiding
                  animate={hide ? "hidden" : "visible"} // Animation based on hide state
                  variants={sidebarVariants} // Variants for animation
                >
                  <Sidebar />
                </motion.div>
              </div>
            </div>
            <div className="flex flex-1 overflow-auto">
              <Element />
            </div>
          </div>

        </div>
      )}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
