import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      orderStatus: null,
    };

    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleOrderSubmit = async () => {
    var item = JSON.parse(sessionStorage.getItem("item"));
    var borrowerId = localStorage.getItem("id");

    const formData = {
      itemId: item._id,
      borrowerId: borrowerId,
      ownerId: item.ownerId,
      numberOfDays: item.numberOfDays || 1,
      price: item.price,
    };

    try {
      const response = await axios.post("http://localhost:3000/items/orders", formData);

      if (response.status === 200) {
        this.setState({
          orderStatus: { type: "success", text: "🎉 Order placed successfully!" },
        });
      } else {
        throw new Error("Order failed. Try again.");
      }
    } catch (error) {
      this.setState({
        orderStatus: { type: "error", text: "⚠️ Failed to process order. Try again." },
      });
    } finally {
      this.setState({ redirect: true });
    }
  };

  handleLogout() {
    localStorage.removeItem("id");
    this.setState({ redirect: true });
  }

  render() {
    const { redirect } = this.state;

    // Redirect to home if login is successful
    if (redirect) {
      return <Navigate to="/home" />;
    }

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
              {this.renderItem(item)}
            </div>
            <div className="col no-gutters">
              {this.renderCheckoutForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderItem(item) {
    return (
      <div className="item-container">
        <div className="item-image">
          <div className="item-details">
            <h3 className="item-name"> {item.name} </h3>
            <h2 className="item-price"> {item.price}$ for {item.numberOfDays} days</h2>
            <h2 className="item-description"> {item.description}</h2>
            <h2 className="item-description"> {item.rating} ⭐ </h2>
          </div>
        </div>
      </div>
    );
  }

  renderCheckoutForm() {
    return (
      <form className="checkout">
        <div className="checkout-container">
          <h3 className="heading-3">Credit card checkout</h3>
          {this.renderInput("Cardholder's Name", "text", "name")}
          {this.renderInput("Your Address", "text", "address")}
          {this.renderInput(
            "Card Number",
            "number",
            "card_number",
            "https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png"
          )}
          <div className="row">
            <div className="col">
              {this.renderInput("Expiration Date", "month", "exp_date")}
            </div>
            <div className="col">
              {this.renderInput("CVV", "number", "cvv")}
            </div>
          </div>
          <button
            className="checkout-btn"
            type="button"
            onClick={this.handleOrderSubmit}
          >
            Borrow
          </button>
        </div>
      </form>
    );
  }

  renderInput(label, type, name, imgSrc) {
    return (
      <div className="input">
        <label>{label}</label>
        <div className="input-field">
          <input type={type} name={name} required />
          {imgSrc && <img src={imgSrc} alt={name} />}
        </div>
      </div>
    );
  }
}
