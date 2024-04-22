import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const errorData = {
    username: false,
    usernamelength: false,
    password: false,
    passwordlength: false,
    passwordmismatch: false };
  const [errors, setErrors] = useState(errorData);
  const { enqueueSnackbar } = useSnackbar();
  //username: string, password: string, confirmPassword: string
  const [userName, setUserName ] = useState("");
  const [password, setPassword]= useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseStatus, setResponseStatus] = useState(false);
  

  const handleRegistration = (message, status) => {
    const key = enqueueSnackbar(message, {
      variant: status, // Adjust variant as needed
    });
   // console.log(key)
  
  };
                                                             
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    let URL = `${config.endpoint}/auth/register`;
    //console.log(URL,"URL DEBUG");
    const {uname, pword} = formData;
    formData = {
      username: uname,
      password: pword,
    } 
    /**
    
     */
   try{
    const response = await axios.post(URL, formData)
    //console.log(response, "RESPONSE DEBUG")
    setResponseStatus(false);
    if (response.status === 201 || response.status ===200){
      handleRegistration("Registred Successfully","success");
     // console.log(response)
    }
    else {
      // Handle other unexpected error codes
      handleRegistration("Something unexpected caused","failure");
      console.error("Unexpected error:", response.status, response.data);
    }
   }
   catch(error){
    setResponseStatus(false);
    if(error.response){
      handleRegistration("Username is already taken","error");
      console.log(error.message);
    }
    else{
      handleRegistration("Something unexpected caused","failure");
      console.log("Somethinng else error: ", error);
    }
   }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    
    let flag =true;
    const {uname, pword, cpword} = data;
    if(!uname){
      setErrors((prevState)=>({...prevState, username: true}));
      //console.log(errors.username, "username debug")
      handleRegistration("Username is required field", "warning")
      flag = false;
    }
    else{
      if(uname.length <6){
        setErrors((prevState)=>({...prevState, usernamelength: true}));
       // console.log(errors.username, "username length debug")
       handleRegistration("Username must be at least 6 characters", "warning")
       flag = false;
      }
    }
    if(!pword){
      setErrors((prevState)=>({...prevState, password:true}));
      //console.log(errors.password, "password debug");
      handleRegistration("Password is required field", "warning")
      flag = false;
    }
    else{
      if(pword.length <6){
        setErrors((prevState)=>({...prevState, passwordlength:true}));
        //console.log(errors.password, "password length debug");
        handleRegistration("Password must be at least 6 characters", "warning")
        flag = false;
      }
    }
    if(cpword !== pword){
      setErrors((prevState)=>({...prevState, passwordmismatch: true}));
      //console.log(errors.passwordmismatch, "password mismatch debug");
      handleRegistration("Passwords do not match", "warning")
      flag = false;
    }
    return flag;
  };
  const userInputHandler = (event )=>{
    setErrors(errorData);
    const triggeredEvent = event.target.name;
    if(triggeredEvent === "username"){
       setUserName(event.target.value)
       //console.log(event.target.value, "USERNAME")
    }
    else if(triggeredEvent === "password"){
        setPassword(event.target.value);
        //console.log(event.target.value, "PASSWORD")
    }
    else{
      setConfirmPassword(event.target.value)
     // console.log(event.target.value, "CONFIRM PASSWORD")
    }
  }
  const onSumbitHandler=()=>{
    setResponseStatus(true);
    const data = {
      uname: userName,
      pword: password,
      cpword : confirmPassword
    }
    const log = validateInput(data);
    if(log){
      register(data)
    }
  }
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={userInputHandler}
            fullWidth
          />
          {errors.username && <p className= "error">* Username is required field</p>}
          {errors.usernamelength && <p className= "error">*Username must be at least 6 characters</p>}
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={userInputHandler}
          />
          {errors.password && <p className= "error">* Password is required field</p>}
          {errors.passwordlength && <p className= "error">* Password must be at least 6 characters</p>}
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"

            type="password"
            onChange={userInputHandler}
            fullWidth
          />
          {errors.passwordmismatch && <p className= "error">* Passwords do not match</p>}
          {responseStatus?
            <Box className="indicator"><CircularProgress size={30}/></Box>:<Button className="button" variant="contained" type="submit" onClick={onSumbitHandler}>
           Register Now
          </Button>}
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
