import React, { Fragment, useState } from 'react';
import "./Header.css";
import {  SpeedDial,SpeedDialAction } from '@mui/material';
import Backdrop from '@material-ui/core/Backdrop'
import  DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useNavigate } from 'react-router';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAlert } from 'react-alert';
import { logout } from "../../../actions/userAction";
import { useDispatch } from 'react-redux';

const UserOptions = ({user}) => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const options = [
        { icon: <ShoppingCartIcon/>, name: "Cart", func: cart },
        { icon: <PersonIcon/>, name: "Profile", func: account },
        { icon: <ExitToAppIcon/>, name: "Logout", func: logoutUser },
    ];

    if(user.role === "admin"){
        options.unshift({
            icon:<DashboardIcon/>,
            name:"Dashboard",
            func:dashboard,
        });
    }

    function dashboard(){
        navigate('/admin/dashboard');
    };
    function cart(){
        navigate("/cart")
    }
    function account(){
        navigate("/account")
    }
    function logoutUser(){
        dispatch(logout());
        alert.success("Logout Successfully");
        navigate("/login");
    }


  return (
    <Fragment>
        <Backdrop open={open} style={{zIndex:"10"}}/>
        <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={()=> setOpen(false)}
        onOpen={()=> setOpen(true)}
        style={{ zIndex : "11" }}
        open={open}
        direction='down'
        className='speedDial'
        icon={<img
        className='speedDialIcon'
        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
        alt='Profile' 
        />
      }
     >
        {options.map((item)=>(
            <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
               />
        ))}
       </SpeedDial>
    </Fragment>
  )
}

export default UserOptions;