import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Container, Box, Button, TextField } from "@mui/material";
import PasswordInput from "./PasswordInput";
import createApiInstance from "../../AxiosInstance";
import axios from "axios";
import ApiHeader from "../api/ApiHeader";
import ProjectApiList from "../api/ProjectApiList";
import CryptoJS from "crypto-js";
import UseCaptchaGenerator from "../Hooks/UseCaptchaGenerator";
import useSystemUniqueID from "../Hooks/UseSystemUniqueId";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceType, setDeviceType] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    captchaInputField,
    captchaImage,
    generateRandomCaptcha,
    getCaptchaData,
    getEncryptedCaptcha,
  } = UseCaptchaGenerator();

  const { fingerprint } = useSystemUniqueID();
  const Authapi = createApiInstance("auth");
  const { getMenuByModule } = ProjectApiList();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobi|android|touch|mini/.test(userAgent)) {
      setDeviceType("mobile");
    } else {
      setDeviceType(null);
    }
  }, []);

  function encryptPassword(plainPassword) {
    const secretKey =
      "c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e";
    const key = CryptoJS.enc.Latin1.parse(
      CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)
    );
    const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
    const iv = CryptoJS.enc.Latin1.parse(ivString);
    const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const captchaData = getCaptchaData();

    // Basic validation
    if (!userId.trim() || !password.trim() || !captcha.trim()) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await Authapi.post("/login", {
        email: userId,
        password: encryptPassword(password),
        moduleId: 19,
        captcha_code: getEncryptedCaptcha(captcha),
        captcha_id: captchaData.captcha_id,
        systemUniqueId: fingerprint,
      });

      fetchMenuList();

      const { token, userDetails } = res.data.data;
      Cookies.set("accesstoken", token, { expires: 1 });

      localStorage.setItem("ulbId", userDetails.ulb_id);
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userDetails.user_type);
      localStorage.setItem("userName", userDetails.user_name);
      localStorage.setItem("device", deviceType);
      localStorage.setItem("name", userDetails?.name);
      localStorage.setItem("userUlbName", userDetails.ulbName);
      localStorage.setItem("roles", JSON.stringify(userDetails.role));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userEmail", userDetails.email);
      localStorage.setItem("ulbIduserMobile", userDetails.mobile);

      if (userDetails.user_type === "Employee" || userDetails.user_type === "Admin") {
        window.location.replace("/parking/dashboard");
      } else if (userDetails.user_type === "Accountant") {
        window.location.replace("/parking/accountant");
      } else {
        window.location.replace("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong!");
      generateRandomCaptcha();
      setCaptcha("");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuList = async () => {
    try {
      const res = await axios.post(
        getMenuByModule,
        { moduleId: 19 },
        ApiHeader()
      );
      const data = res?.data;

      localStorage.setItem("menuList", data?.data?.permission || "");

      if (data?.data?.userDetails && data?.data?.permission) {
        localStorage.setItem("userDetail", JSON.stringify(data.data.userDetails));
        localStorage.setItem("userPermission", JSON.stringify(data.data.permission));
      }
    } catch (error) {
      console.error("Error fetching menu list", error);
    }
  };

  return (
    <Container>
      <Box mt={2}>
        <form onSubmit={handleLogin} className="bg-white p-4 md:p-16 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Welcome Back
          </h1>

          {errorMsg && (
            <div className="text-center text-red-500 mb-4">{errorMsg}</div>
          )}

          <div className="mb-4">
            <TextField
              label="Username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
          </div>

          <div className="mb-4">
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
          </div>

          <div className="my-4">
            <div className="flex justify-between items-center mb-2">
              <img src={captchaImage} className="border rounded w-44 h-14" />
              <button
                type="button"
                onClick={generateRandomCaptcha}
                className="text-xs text-blue-500"
              >
                Reload Captcha
              </button>
            </div>
            {/* Replace formik-based captcha input with plain input */}
            <div className="mt-2">
              {captchaInputField({
                value: captcha,
                onChange: (e) => setCaptcha(e.target.value),
              })}
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#665DD9" }}
            fullWidth
            disabled={loading}
          >
            {loading ? "Loading..." : "Log in"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
