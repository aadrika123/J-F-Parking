import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Cookies from "js-cookie";
import AppRoutes from "./Routes/AppRoutes";
import img from "./assets/loader.json";
import Lottie from "lottie-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    console.log(token);

    if (token && token !== "undefined") {
      setAccessToken(token);
      if (userType) {
        setUserType(userType);
      } else {
        setOpen(true);
      }
    } else if (token !== null) {
      // Check if token is not null (i.e., local storage is not empty)
      setOpen(true);
    }

    setLoading(false);
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.clear(); // Clear local storage to remove invalid tokens
    window.location.href = "/parking"; // Redirect to login route
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center h-screen">
        <Lottie animationData={img} loop={true} className="w-60 h-60" />
      </div>
    );
  }

  return (
    <>
      <Router basename="/parking">
        <AppRoutes access_token={accessToken} userType={userType} />
      </Router>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your session has expired. Please log in again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
