import React, { Fragment } from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard.js"; 

const Cart = () => {

    const item = {
        product:"ProductId",
        price:20000,
        name:"macbook",
        quantity:1,
        image:"https://i.ibb.co/DRST11n/1.webp",

    }
    
  return (
    <Fragment>
        <div className="cartPage">
            <div className="cartHeader">
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
            </div>

            <div className="cartContainer">
                <CartItemCard item={item}/>
                <div className="cartInput">
                    <button>-</button>
                    <input type="number" value={item.quantity}  readOnly/>
                    <button>+</button>
                </div>
                <p className='cartSubtotal'>{`₹${
                    item.price*item.quantity
                }`}</p>
            </div>
            <div className="cartContainer">
                <CartItemCard item={item}/>
                <div className="cartInput">
                    <button>-</button>
                    <input type="number" value={item.quantity}  readOnly/>
                    <button>+</button>
                </div>
                <p className='cartSubtotal'>{`₹${
                    item.price*item.quantity
                }`}</p>
            </div>
            <div className="cartContainer">
                <CartItemCard item={item}/>
                <div className="cartInput">
                    <button>-</button>
                    <input type="number" value={item.quantity}  readOnly/>
                    <button>+</button>
                </div>
                <p className='cartSubtotal'>{`₹${
                    item.price*item.quantity
                }`}</p>
            </div>
            <div className="cartGrossProfit">
                <div></div>
                <div className="cartGrossProfitBox">
                    <p>Gross Total</p>
                    <p>{`₹60000`}</p>
                </div>
                <div></div>
                <div className="checkOutBtn">
                    <button>Check Out</button>
                </div>
            </div>

        </div>
    </Fragment>
  );
};

export default Cart;