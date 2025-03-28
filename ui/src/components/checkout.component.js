import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      address: "",
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      loading: false,
      statusMessage: null,
      item: props.location?.state?.item || null, // Get item from navigation state
      redirectToHome: false, // To handle redirection after success
      isLoggedIn: localStorage.getItem("loggedIn") || false, // Check login status
    };
  }

  // Redirect if no item is selected
  componentDidMount() {
    if (!this.state.item) {
      var item = sessionStorage.getItem('item');
      this.setState({item: JSON.parse(item)})
    }
  }

  // Handle input changes
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // Handle logout
  handleLogout = () => {
    localStorage.removeItem("loggedIn");
    this.setState({ isLoggedIn: false, redirectToHome: true });
  };

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, statusMessage: null });

    const {
      name,
      email,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      item,
    } = this.state;

    // Prepare data to send to backend
    const orderData = {
      itemId: item._id,
      itemName: item.name,
      price: item.price,
      name,
      email,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/checkout",
        orderData
      );

      if (response.status === 200) {
        this.setState({
          statusMessage: {
            type: "success",
            text: "🎉 Order placed successfully! Redirecting to home...",
          },
        });

        // Redirect to home after 3 seconds
        setTimeout(() => {
          this.setState({ redirectToHome: true });
        }, 3000);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      this.setState({
        statusMessage: {
          type: "error",
          text: "⚠️ Failed to place order. Please try again.",
        },
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      name,
      email,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      loading,
      statusMessage,
      item,
      redirectToHome,
      isLoggedIn,
    } = this.state;

    // Redirect if not logged in or after success
    if (!isLoggedIn || redirectToHome) {
      return <Navigate to="/" />;
    }

    return (
      <div className="App min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-md w-full">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Community Lending App
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={this.handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="container" style={{ paddingTop: "100px" }}>
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">
              Checkout: {item?.name}
            </h2>

            {/* Status message */}
            {statusMessage && (
              <div
                className={`p-3 mb-4 rounded-lg text-center ${
                  statusMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={this.handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={address}
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={this.handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {/* Credit Card Details (if selected) */}
              {paymentMethod === "creditCard" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardNumber}
                      onChange={this.handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={this.handleChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cvv}
                        onChange={this.handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Checkout;
