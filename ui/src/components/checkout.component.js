import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

export default class Checkout extends React.Component {

  render(){
    var itemJSON = sessionStorage.getItem("item");
    var item = JSON.parse(itemJSON);
    return (
      <div>
          <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-md w-full">
          <div className="container">
            <Link className="navbar-brand" to={"/sign-in"}>
              Community Lending App
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={this.handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      <div className="app-container">
        <div className="row">
          <div className="col">
            <Item name={item.name} price={item.price} 
            days={item.numberOfDays} 
            rating={item.rating} 
            description={item.description} />
          </div>
          <div className="col no-gutters">
            <CheckoutForm />
          </div>
        </div>
       </div>
       </div>
    )
  }
}

const Item = (props) => (
  <div className="item-container">
    <div className="item-image">
      <img src={props.img}/>
      <div className="item-details">
        <h3 className="item-name"> {props.name} </h3>
        <h2 className="item-price"> {props.price}$ for {props.days} days</h2>
        <h2 className="item-description"> {props.description}</h2>
        <h2 className="item-description"> {props.rating} ⭐ </h2>
      </div>
    </div>
  </div>
);

const CheckoutForm = (props) => (
 <form className="checkout">
    <div className="checkout-container">
     <h3 className="heading-3">Credit card checkout</h3>
     <Input label="Cardholder's Name" type="text" name="name" />
     <Input label="Your Address" type="text" name="address" />
     <Input label="Card Number" type="number" name="card_number" imgSrc="https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png" />
      <div className="row">
        <div className="col">
          <Input label="Expiration Date" type="month" name="exp_date" />
        </div>
        <div className="col">
          <Input label="CVV" type="number" name="cvv" />
        </div>
      </div>
      <Button text="Borrow" type="submit" />
    </div>
 </form>
);

const Input = (props) => (
  <div className="input">
    <label>{props.label}</label>
    <div className="input-field">
      <input type={props.type} name={props.name} required/>
      <img src={props.imgSrc}/>
    </div>
  </div>
);

const Button = (props) => (
  <button className="checkout-btn" type="button">{props.text}</button>
);