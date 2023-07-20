/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Navbar from "./navbar/Navbar";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { Button, Box, Text, Input, Image, FormControl } from '@chakra-ui/react';

const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

const ResetPassword = ({isDarkMode, setIsDarkMode}) => {
    const location = useLocation();
    const [token] = useState(location.state.token);
    const [showPassword, setShowPassword] = useState(false);
    const [pass, setPass] = useState();
    const [email, setEmail] = useState();
    const [isVerified, setIsVerified] = useState(false);
    const [OTPsent, SetOTPsent] = useState();
    const [enteredOTP, setEnteredOTP] = useState('');
    // const navigate = useNavigate();

    const showToastMessage = (message, Successful) =>{
    
        (Successful ? toast.success(message, {position: "top-center",closeOnClick: true, 
        draggable: true, theme: "dark", autoClose: 3000,
        pauseOnHover: false,
        }) : toast.warn(message, {position: "top-center",closeOnClick: true, 
        draggable: true, theme: "dark", autoClose: 3000,
        pauseOnHover: false,
        }))
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    
    const sendOTP = async (otp) => {
    try{
        const checkEmail = await api.post('/api/socialSquare/register', {email: email, isReset: true});
        if(checkEmail.data.message == false){
        showToastMessage("Could not find an account with this email", false);
        return false
        }
        else{
            try{
                let response = await api.post('/api/socialSquare/sendOTP', {to: email, 
                    subject: "OTP for verification", text: otp});
                if (response.status == 200){
                return true
                }
                else{
                    showToastMessage(response.data.message, false);
                }
            }
            catch(er){
                showToastMessage(er.response.data.message, false);
            }
        }
    }
    catch(er){
        showToastMessage(er.response.data, false);
        return false
    }
    }

    const handleOTPSent = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToastMessage("Enter a valid email", false);
        return null;
    }

    let otp = Math.floor(100000 + Math.random() * 900000)
    let isSent = sendOTP(otp);
    isSent.then(result => {
        (result ? showToastMessage("OTP sent to: " + email, true) : "")
        result ? SetOTPsent(otp) : null;
    });
    }

    const verifyOTP = () => {

    if(OTPsent == parseInt(enteredOTP)) {
        setIsVerified(true);
        showToastMessage("E-mail Verified", true);
    }
    else{
        showToastMessage("Invalid OTP", false)
    }
    }

    const handlePasswordReset = async () => {
        try{
            const response = await api.post('/api/socialSquare/reset', {email: email, password: pass});
            if(response.status == 200){
                showToastMessage(response.data.message, true);
            }
        }
        catch(er){
            showToastMessage(er.response.data.message, false);
        }
    }

    return (
        <>
        <Box className="container-fluid px-0 overflow-hidden"
        maxHeight={"100vh"} 
        bg={!isDarkMode ? "" : "dark.background"}
        transition={"ease-in 0.5s"}
        >
      <ToastContainer />
      <Box className="row">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} token={token}/>
      </Box>
      <Box className="row">
        <Box className="col-12 d-flex">
        <Box className="Auth-form-container" >
        <FormControl className="Auth-form bg-dark" mt={-20} maxWidth={"30%"}>
        <Box className="Auth-form-content bg-dark">
          <h3 className="Auth-form-title head-title">Reset Password</h3>

          {/* Email Section */}
          <Box className="form-group mt-3">
            <label className="input-Label">Email address</label>
            <Box className="d-flex justify-content-between mt-2 align-items-center">
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                readOnly = {isVerified ? true : false}
                onChange={(e) => setEmail(e.target.value)}
                style={{width: "220px"}}
              />
              <button 
              className={OTPsent ? "btn btn-secondary py-1" : "btn btn-primary py-1"} 
              onClick={handleOTPSent}
              type="button"
              style={{height:"35px"}}
              disabled = {OTPsent ? true : false}
              >{OTPsent ? "OTP sent" : "Send OTP"}</button>
            </Box>
            
            {/* if OTP is sent and if it is not verified then show the confirm otp textbox and button */}
            {OTPsent && !isVerified ? <Box className="d-flex justify-content-between mt-2 align-items-center">
              <input 
              type="text" 
              className="form-control"
              placeholder="Enter OTP"
              value = {enteredOTP}
              onChange={(e) => setEnteredOTP(e.target.value)}
              style={{width: "220px"}}
              />
              <button
              className={isVerified ? "btn btn-secondary" :"btn btn-primary"}
              type="button"
              onClick={verifyOTP}
              style={{height:"35px", width: "91px"}}
              >
                {isVerified ? "Confirmed": "Confirm"}
              </button>
            </Box> : null}
          </Box>

          <Box className="form-group mt-3">
            <label className="input-Label">Password</label>
            <Box className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mt-1 rounded"
                maxLength={16}
                minLength={8}
                placeholder="Password"
                onChange={(e) => setPass(e.target.value)}
              />
              <Box className="input-group-append d-flex mt-3 mx-1" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? (
                  <RiEyeOffLine className="input-icon head-title" />
                ) : (
                  <RiEyeLine className="input-icon head-title" />
                )}
              </Box>
            </Box>
          </Box>

          <Box className="d-grid gap-2 mt-3">
            <button type="button" className="btn btn-primary" disabled={!isVerified} onClick={handlePasswordReset}>
              Reset
            </button>
          </Box>
        </Box>
      </FormControl>
    </Box>
        </Box>
      </Box>
    </Box>
        </>
    );
};


export default ResetPassword;
