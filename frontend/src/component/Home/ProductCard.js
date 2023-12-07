import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";




const ProductCard = ({product}) => {

  const options = {
    edit:false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth < 600 ? 20 : 25, 
    value: product.rating, 
    isHalf:true,
};

  return (
    <Link className='productCard' to={`/product/${product._id}`}>
        {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))} 
        <p>{product.name}</p>
        <div>
            <ReactStars {...options}/> 
            <span>({product.noOfReviews}Reviews)</span>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>
   
  )
}

export default ProductCard;