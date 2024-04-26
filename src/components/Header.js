import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Stack, Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom"; 
import "./Header.css";



const Header = ({ children, hasHiddenAuthButtons }) => {
  //console.log("hasHiddenAuthButtons::",hasHiddenAuthButtons)
  let history = useHistory();
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");
  const headerNavigator=(route)=>{
    history.push(route);
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
       {hasHiddenAuthButtons ?
        <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick ={()=>{history.push("/")}}
      >
        Back to explore
      </Button>:token?
       <Stack spacing={2} direction="row">
        <Avatar src="avatar.png" alt={username}/>
        <p className="username-text">{username}</p>
        <Button sx={{color:"#4caf50"}}  onClick ={()=>{localStorage.clear();window.location.reload()}}>LOGOUT</Button>
       </Stack>:
       <Stack spacing={2} direction="row">
       <Button sx={{color:"#4caf50"}} onClick ={()=>{history.push("/login")}}>LOGIN</Button>
       <Button variant="contained" sx={{backgroundColor:"#4caf50"}} onClick ={()=>{history.push("/register")}}>REGISTER</Button>
       </Stack>}
      </Box>
    );
};

export default Header;
