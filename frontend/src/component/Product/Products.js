import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css";
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams  } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {useAlert} from "react-alert";
import Metadata from '../layout/Metadata';

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];


const Products = () => {

  const dispatch = useDispatch();

  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice]= useState([0,25000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);


  const {products, loading, error, productsCount ,resultPerPage, filteredProductsCount} = useSelector(
    (state)=> state.products
    );

    const params = useParams();
    
    const keyword = params.keyword;

    const setCurrentPageNo = (e)=>{
      setCurrentPage(e)
    };

    const priceHandler = (event,newPrice)=>{
      setPrice(newPrice);
    }
 


  useEffect(() => {

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, price, category, rating, alert, error]);

  let count = filteredProductsCount;
  
  return (
    <Fragment>
      { loading ? <Loader/> : <Fragment>
        <Metadata title="PRODUCTS--ECOMMERCE"/>
        <h2 className="productsHeading">Products</h2>

        <div className="products">
          {products && products.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>  

        <div className="filterBox">
          <Typography>Price</Typography>  
          <Slider
             value={price}
             onChange={priceHandler}
             valueLabelDisplay="auto"
             area-labelledby="range-slider"
             min={0}
             max={25000}
             />

             <Typography>Categories</Typography>
             <ul className="categoryBox">
              {categories.map((category) => (
                <li
                className='category-link'
                key={category}
                onClick={()=> setCategory(category)}
                >
                  {category}
                </li>
                
              ))}
             </ul>
             <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider 
              value={rating}
              onChange={(e,newRating) => {
                setRating(newRating);
              }}
              aria-labelledby="continuous-slider"
              min={0}
              max={5}
              valueLabelDisplay="auto"
              />
             </fieldset>
        </div>
        
        {resultPerPage < count && (
          <div className="paginationBox">
          <Pagination
          activepage={currentPage}
          itemsCountPerpage={resultPerPage}
          totalItemsCount={productsCount}
          onChange={setCurrentPageNo}
          nextPageText="Next"
          prevPageText="Prev"
          firstPageText="1st"
          lastPageText="Last"
          itemClass="page-item"
          linkClass="page-link"
          activeClass="pageItemActive"
          activeLinkClass="pageLinkActive"

           />

        </div>
        )}
      </Fragment> }
    </Fragment>
  )
}

export default Products;