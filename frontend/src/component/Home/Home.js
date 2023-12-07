import React, { Fragment ,useEffect} from 'react';
import "./Home.css";
import { CgMouse} from "react-icons/cg";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/Metadata";
import {clearErrors, getProduct } from "../../actions/productAction";

import {useDispatch ,useSelector} from "react-redux";
import Loading from "../layout/Loader/Loader";
import {useAlert} from 'react-alert';
import Search from '../Product/Search';
import { Link } from 'react-router-dom';


const Home = () => {
  

  const alert = useAlert();

    const dispatch = useDispatch();

    const {user} = useSelector((state)=> state.user);

    const { loading, error, products } =useSelector(
        (state)=> state.products
        );
    
    useEffect(() => {

      if(error){
    alert.error(error);
    dispatch(clearErrors())

      }
        dispatch(getProduct());
    }, [dispatch , alert , error]);
    
  return (
    <Fragment>
      {loading ? (
        <Loading/>
      ) : (
      <Fragment>

<MetaData title="Ecommerce"/>
<div className="banner">
      <div className="LoginBox">
        
        
      {!user  ? <Link to="/login" className='LoginBtn' >Login</Link> : <> </>}


      </div>
 
      <Search/>
    
    <p>Welcome to Ecommerce</p>
    <h1>FIND AMAZING PRODUCT BELOW</h1>

    <a href="#container">
        <button>
            Scroll <CgMouse/>
        </button>
    </a>
</div>
<h2 className="homeHeading">Featured Products</h2>
<div className="container" id='container'>


{products && products.map((product) => <ProductCard product={product} /> )}

</div>
</Fragment>
)}
    </Fragment>
  )
}

export default Home;


// {/* <div className="searchBar">
//     <input type="text" placeholder='Find your product Here'/>
//     <button>Search</button>
//     </div> */}