import React, { Fragment, useEffect } from 'react';
import Sidebar from "./Sidebar.js";
import "./Dashboard.css"
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {CategoryScale} from 'chart.js'; 
import { getAdminProduct } from '../../actions/productAction.js';
import { getAllUsers } from '../../actions/userAction.js';
Chart.register(CategoryScale);


const Dashboard = () => {

   
  const {  products } = useSelector((state)=> state.products);

  const {users} = useSelector((state)=> state.allUsers);

  const dispatch = useDispatch();


  let outOfStock = 0;

  products.forEach((item)=>{
    if(item.stock ===0 ){
      outOfStock += 1;
    }
  });
  useEffect(()=>{
    dispatch(getAdminProduct());
    dispatch(getAllUsers());
  },[dispatch]);

    const {user} = useSelector((state)=> state.user);
    let isAdmin = true;
    if(user.role!=="admin"){
        isAdmin = false;
    };

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
          {
            label: "TOTAL AMOUNT",
            backgroundColor: ["tomato"],
            hoverBackgroundColor: ["rgb(197, 72, 49)"],
            data: [0, 4000],
          },
        ],
      };;

      const doughnutState = {
        labels: ["Out Of Stock", "InStock"],
        datasets: [
          {
            backgroundColor: ["#00A6B4", "#6800B4"],
            hoverBackgroundColor: ["#4B5000", "#35014F"],
            data: [outOfStock,products.length - outOfStock],
          },
        ],
      };;

  return ( 
    <Fragment>
        {isAdmin ? <div className='dashboard'>
        <Sidebar/>
        <div className='dashboardContainer'>

            <Typography component="h1">Dashboard</Typography>

            <div className="dashboardSummary">
                <div>
                    <p>
                        Total Amount <br /> 2000
                    </p>
                </div>
                <div className="dashboardSummaryBox2">

                    <Link to="/admin/products">
                        <p>Product</p>
                        <p>{products && products.length}</p>
                    </Link>

                    <Link to="/admin/orders">
                        <p>Orders</p>
                        <p>4</p>
                    </Link>

                    <Link to="/admin/users">
                        <p>Users</p>
                        <p>{users && users.length}</p>
                    </Link>
                </div>
            </div>

            <div className="lineChart">
                <Line data={lineState}/>
            </div>
            <div className="doughnutChart">
                <Doughnut data={doughnutState}/>
            </div>

        </div>
    </div> : <Navigate to="/login"/> }

    </Fragment>
   
    
  );
};

export default Dashboard;