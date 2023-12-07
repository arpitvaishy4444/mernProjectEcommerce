import React, { Fragment, useEffect } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import Metadata from '../layout/Metadata';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';



const UserList = () => {

  const dispatch = useDispatch();

  const alert = useAlert();

  const navigate = useNavigate();

  const { error, users } = useSelector((state)=> state.allUsers);

  const {error:deleteError, isDeleted, message } = useSelector((state)=> state.profile);

    const {user} = useSelector((state)=> state.user);
    let isAdmin = true;
    if(user.role!=="admin"){
        isAdmin = false;
    }

    const deleteUserHandler = (id)=>{
      dispatch(deleteUser(id))
    };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if(isDeleted){
        alert.success(message);
        navigate("/admin/users");
        dispatch({type:DELETE_USER_RESET});
        
    }
    dispatch(getAllUsers());
  }, [dispatch, alert, error, navigate, deleteError, isDeleted, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8},

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={()=> deleteUserHandler(params.id,"id")}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      {isAdmin ? <Fragment>
  <Metadata title={'All USERS - Admin'}/>

  <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>




</Fragment> : <></>}

    </Fragment>

    
  )
}

export default UserList;