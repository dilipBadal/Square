/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Box, Image, FormControl } from '@chakra-ui/react';
import "bootstrap/dist/css/bootstrap.min.css"
import { useState} from "react"
import { useNavigate } from 'react-router-dom';
import Navbar from "../navbar/Navbar"
import "./Auth.css"

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export default function Auth ({isDarkMode, setIsDarkMode}) {
  const [authMode, setAuthMode] = useState("signin")
  const [showPassword, setShowPassword] = useState(false);
  const [usn, setUsn] = useState();
  const [pass, setPass] = useState();
  const [name, setName] = useState();
  const [dob, setDob] = useState('');
  const [validDOB, setValidDOB] = useState();
  const [email, setEmail] = useState();
  const [usnError, setUsnError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [OTPsent, SetOTPsent] = useState();
  const [enteredOTP, setEnteredOTP] = useState('');
  
  const navigate = useNavigate();

  const showToastMessage = (message, Successful) =>{
    
    (Successful ? toast.success(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }) : toast.warn(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }))
  }


  // Update the token in state and localStorage when it changes
  const updateToken = (newToken, currentUser) => {
    localStorage.clear();
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', currentUser);
  };



  const handleLogin = async (e) => {
    e.preventDefault();
  
    const username = usn
    const password = pass
  
    try {
      setEmailError(false);
      const response = await api.post('/api/socialSquare/login', { username, password });
      if (response.status === 200) {
        // Retrieve the token from the response
        const { token } = response.data;
        const {username} = response.data;
    
        updateToken(token, username);
    
        // Redirect to the homepage
        (token ? navigate('/homepage', { state: { username: username, isLoggedIn: true } }) : null )
      }
    } catch (error) {
      showToastMessage(error.response.data.message)
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if(!usn || !name || !dob || !email || !pass){
        showToastMessage("Fields cannot be empty", false);
        return null
      }

      if(usn.length < 5){
        showToastMessage("Username must be atleast 5 characters", false);
        return null
      }
      else if(name.lenth < 5){
        showToastMessage("Name must be atleast 5 characters", false);
        return null
      }
      else if(pass.lenth < 8 || pass.length > 16){
        showToastMessage("Password must be atleast 8 characters and atmost 16", false);
        return null
      }

      // Make a POST request to register the user
      setUsnError(false)
      setEmailError(false);
      const response = await api.post('/api/socialSquare/register', {usn, name, dob, email,pass});
      showToastMessage("Registration Successful", true);
      setAuthMode('signin');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setUsnError(true);
        showToastMessage("Username already taken");
      }
      else if(error.response && error.response.status === 410){
        setEmailError(true);
        showToastMessage("Email alrady taken");
      }
      else {
        showToastMessage(error.response.data.message);
        setUsnError(false)
        setEmailError(false);
      }
    }
  };

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
    setUsn('');
    setPass('');
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendOTP = async (otp) => {
    try{
      const checkEmail = await api.post('/api/socialSquare/register', {email: email, isEmailVerify: true});
      if(checkEmail.data.message == false){
        showToastMessage("Email already registered", false);
        return false
      }
      else{
        let response = await api.post('/api/socialSquare/sendOTP', {to: email, 
          subject: "OTP for verification", text: otp});
          if (response.status == 200){
            return true
          }
      }
    }
    catch(er){
      showToastMessage(er.response, false);
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

  const handleDObValidation = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 100);
    const minAllowedDate = new Date();
    minAllowedDate.setFullYear(currentDate.getFullYear() - 16);
  
    if (selectedDate < minDate || selectedDate > currentDate) {
      // Invalid DOB
      showToastMessage("Invalid Date", false);
      setValidDOB(false);
    } else if (selectedDate > minAllowedDate) {
      // Below minimum age (16 years)
      showToastMessage("Minimum age requirement is 16 years", false);
      setValidDOB(false);
    } else {
      // Valid DOB
      setValidDOB(true);
      setDob(e.target.value);
    }
  }
  
    return (
      (authMode == "signin" ?
        <Box className="container-fluid px-0 overflow-hidden"
        bg={!isDarkMode ? "" : "dark.background"}
        transition={"ease-in 0.5s"}
        >
          <ToastContainer />
          <Box className="row">
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </Box>
          <Box className="d-flex align-items-center bold flex-column">
            <p className="py-0 my-0 text-secondary" style={{fontSize: "50px"}}>Building Connections, One Square at a Time</p>
          </Box>
          <Box className="row">
            <Box className="col-6 px-5">
            < LeftSection isDarkMode={isDarkMode} />
            </Box>
            <Box className="col-6 d-flex align-center">
            <Box className="Auth-form-container">
          <FormControl mt={-20} maxWidth={"55%"} className="Auth-form bg-dark card shadow" onSubmit={handleLogin}>
            <Box className="Auth-form-content bg-dark">
              <h3 className="Auth-form-title head-title">Sign In</h3>
              <Box className="text-center head-title">
                Not registered yet?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign Up
                </span>
              </Box>
              <Box className="form-group mt-3">
                <label className="input-Label">Username</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="Enter Username"
                  onChange={(e) => setUsn(e.target.value)}
                />
              </Box>
              
            <Box className="form-group mt-3">
              <label className="input-Label">Password</label>
              <Box className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mt-1 rounded"
                  placeholder="Password"
                  onChange={(e) => setPass(e.target.value)}
                />
                <Box className="input-group-append d-flex mt-3 mx-1" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                  {showPassword ? (
                    <RiEyeOffLine className="input-icon head-title" />
                  ) : 
                  (
                    <RiEyeLine className="input-icon head-title" />
                  )}
                </Box>
              </Box>
            </Box>
              <Box className="d-grid gap-2 mt-3">
                <button type="button" className="btn btn-primary" onClick={handleLogin}>
                  Submit
                </button>
              </Box>
              <p className="text-center mt-2 head-title">
                Forgot <a href="#">password?</a>
              </p>
            </Box>
          </FormControl>
        </Box>
        </Box>
          </Box>
            </Box>:
    <Box className="container-fluid px-0 overflow-hidden"
    maxHeight={"100vh"} 
    bg={!isDarkMode ? "" : "dark.background"}
    transition={"ease-in 0.5s"}
    >
      <ToastContainer />
      <Box className="row">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      </Box>
      <Box className="d-flex align-items-center bold flex-column">
            <p className="py-0 my-0 text-secondary" style={{fontSize: "50px"}}>Building Connections, One Square at a Time</p>
          </Box>
      <Box className="row">
        <Box className="col-6 mx-0 px-5">
          < LeftSection isDarkMode={isDarkMode}/>
        </Box>
        <Box className="col-6 d-flex">
        <Box className="Auth-form-container" >
        <FormControl className="Auth-form bg-dark" mt={-20} maxWidth={"55%"}>
        <Box className="Auth-form-content bg-dark">
          <h3 className="Auth-form-title head-title">Sign Up</h3>
          <Box className="text-center head-title">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </Box>

          <Box className="form-group mt-3 d-flex direction-col">
            <Box className=" me-1">
            <label className="input-Label">Full Name</label>
            <input
              maxLength={20}
              minLength={5}
              type="text"
              className="form-control mt-1"
              placeholder="e.g Dilip Badal"
              onChange={(e) => setName(e.target.value)}
            />
            </Box>
            <Box className=" ms-1">
            <label className="input-Label">Username</label>
            <input
              type="text"
              className={"form-control mt-1 " + (usnError ? "alreadyExisits": "")}
              placeholder="e.g dbadal123"
              onChange={(e) => setUsn(e.target.value)}
              maxLength={10}
              minLength={5}
            />
            </Box>
          </Box>

          {/* Email Section */}
          <Box className="form-group mt-3">
            <label className="input-Label">Email address</label>
            <Box className="d-flex justify-content-between mt-2 align-items-center">
              <input
                type="email"
                className={"form-control mt-1 " + (emailError ? "alreadyExisits": "")}
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

          {/* Date of Birth Seciton */}
          <Box className="form-group mt-3">
            <label className="input-Label">Date of Birth</label>
            <input
              type="date"
              className="form-control mt-1"
              value = {validDOB ? dob : ""}
              placeholder="DoB Address"
              onChange={(e) => handleDObValidation(e)}
            />
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
            <button type="button" className="btn btn-primary" disabled={!isVerified} onClick={handleRegister}>
              Submit
            </button>
          </Box>
        </Box>
      </FormControl>
    </Box>
        </Box>
      </Box>
    </Box>)
    )
}

function LeftSection({isDarkMode}){
  return (
    <Box my={20} className="vh-80 overflow-hidden d-flex align-items-center justify-content-center"
    >
    <Image src='resources/images/login.png' alt="login form" width="500px" height="480px" 
    transition={"ease-in 0.5s"}
    borderRadius={!isDarkMode ? "" : "10%"}/>
    </Box>
  )
}

