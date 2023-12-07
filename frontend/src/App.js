import './App.css';
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer"
import { BrowserRouter as Router , Route ,Routes} from 'react-router-dom';
import webFont from "webfontloader";
import React from 'react';
import Home from './component/Home/Home';
import ProductDetails from "./component/Product/ProductDetails";
import Products from './component/Product/Products';
import LoginSignup from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile"
import store  from './store';
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions"
import { useSelector } from 'react-redux';
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Dashboard from "./component/admin/Dashboard";
import ProductList from "./component/admin/ProductList";
import NewProduct from './component/admin/NewProduct';
import UsersList from "./component/admin/UsersList";
import UpdateUser from "./component/admin/UpdateUser";
import ProductReviews from './component/admin/ProductReviews';
import ContactPage from "./component/layout/Contact/ContactPage";
import About from "./component/layout/About/about";






function App() {

  const {isAuthenticated, user} = useSelector(state=>state.user);


  React.useEffect(()=>{
    webFont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    });

    store.dispatch(loadUser());
  
  },[]);

  return (
     <Router>
      <Header/>


      {isAuthenticated && <UserOptions user={user}/>} 
      <Routes>
      
      <Route exact path='/' Component={Home}/>
      <Route exact path='/product/:id' Component={ProductDetails}/>
      <Route exact path='/products' Component={Products}/>
      <Route path='/products/:keyword' Component={Products}/>
      <Route  exact path='/contact' Component={ContactPage}/>
      <Route  exact path='/about' Component={About}/>


      {isAuthenticated && <Route exact path='/account' Component={Profile}/>}
      {isAuthenticated && <Route exact path='/me/update' Component={UpdateProfile}/>}
      {isAuthenticated && <Route exact path='/password/update' Component={UpdatePassword}/> }


      <Route exact path='/password/forgot' Component={ForgotPassword}/> 
      <Route exact path='/password/reset/:token' Component={ResetPassword}/>

      <Route exact path='/login' Component={LoginSignup}/>

      <Route exact path='cart' Component={Cart}/>

      {isAuthenticated  && <Route  exact path='/admin/dashboard' Component={Dashboard}/>} 

      {isAuthenticated  && <Route  exact path='/admin/products' Component={ProductList}/>} 

      {isAuthenticated  && <Route  exact path='/admin/product/new' Component={NewProduct}/>}


      {isAuthenticated  && <Route  exact path='/admin/users' Component={UsersList}/>} 

      {isAuthenticated  && <Route  exact path='/admin/user/:id' Component={UpdateUser}/>} 

      {isAuthenticated  && <Route  exact path='/admin/reviews' Component={ProductReviews}/>} 

      




      </Routes>
      
      <Footer/>
    </Router>
      
      

    

  );
}

export default App;
