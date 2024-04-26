import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useRef, useEffect } from "react";
import { useHistory, Link} from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";


const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [responseStatus, setResponseStatus] = useState(false);
  const inputRef = useRef(null);
  let history = useHistory();



  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    const URL = `${config.endpoint}/auth/login`;
   // console.log("URL::",URL )
    try{
    const response = await axios.post(URL, formData, {timeout: 4000});
    setResponseStatus(false);
    //console.log("Reponse::", response);
    if(response.status === 201){
      const data = await response.data;
      const {username, balance, token} = data;
      persistLogin(token, username, balance);
      enqueueSnackbar("Logged in successfully", {variant:"success"});
      history.push("/")
    }
  }
  catch (error){
    if(error.response){
      //console.log("ERROR REPOMSE::", error)
      enqueueSnackbar("Password is incorrect", {variant:"warning"});
      setResponseStatus(false);
    }
    else{
      if(error.message === "Network Error"){
        enqueueSnackbar("Server is not running", {variant:"warning"});
        //console.log("ERROR REPOMSE::", error.message)
        setResponseStatus(false);
      }
      else{
      enqueueSnackbar("Something went wrong", {variant:"warning"});
      //console.log("ERROR REPOMSE::", error.message)
      setResponseStatus(false);
    }
    }
  }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    const {username, password} = data;
    //console.log(username,password)
    let flag = true;
    if(!username){
       flag = false;  
       enqueueSnackbar("Username is a required field", {variant:"warning"});
       setResponseStatus(false);
       
    }
    else if (!password){
      flag = false; 
      enqueueSnackbar("Password is a required field", {variant:"warning"})
      setResponseStatus(false);
    }
    return flag;
    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("balance", balance);
  };
  const onChangeHandler =(event)=>{
      if(event.target.name === "username"){
       setInputUsername(event.target.value)
       //console.log("logging username");
      }
      else{
        setInputPassword(event.target.value);
        //console.log("logging password");
      }
  }
  const onSumbitHandler=()=>{
    setResponseStatus(true);
    const data = {
      username: inputUsername,
      password: inputPassword,
    }
    const valid = validateInput(data);
    if(valid){
      login(data)
    }
  }
  useEffect(()=>{
    inputRef?.current?.focus();
  },[])


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
        <TextField
          id="username"
          label="Username"
          name = "username"
          title="Username"
          inputRef ={inputRef}   
          onChange={onChangeHandler}
          placeholder="Enter Username"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          id="password"
          type="password"
          name ="password"
          label="Password"
          title="Password"  
          onChange={onChangeHandler}  
          placeholder="Enter Password" 
          variant="outlined"
          required
          fullWidth     
        />
       
       { responseStatus?
            <Box className="indicator"><CircularProgress size={30}/></Box>: <Button variant ="contained" onClick={onSumbitHandler}>LOGIN TO QKART</Button>}
          <p className="secondary-action">
          Don't have an account? {" "}
          <Link to="/register" className="link"> Register now</Link>
        </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
