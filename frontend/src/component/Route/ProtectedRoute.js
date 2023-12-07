import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate} from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user, isAuthenticated, loading } = useSelector((state)=> state.user);

  return (
    <Fragment>
        {!loading && (
            <Route
            {...rest}
            render={(props)=> {
                if(!isAuthenticated){
                    return <Navigate to="/login" />;
                }
                return <Component {...props} />;
            }}
            />
        )}

    </Fragment>
    
  )
}

export default ProtectedRoute;