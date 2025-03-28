import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
      isLoggedIn: false,
    };
  }

  // Fetch orders for the logged-in user
  async componentDidMount() {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const userId = localStorage.getItem("id");

    if (!isLoggedIn || !userId) {
      this.setState({ isLoggedIn: false });
      return;
    }

    var data = {id: userId}
    try {
      const response = await axios.get(`http://localhost:3000/items/orders/`, {params : data});
      this.setState({
        orders: response.data,
        loading: false,
        isLoggedIn: true,
      });
      console.log(response.data)
    } catch (error) {
      this.setState({
        error: "Error fetching orders. Please try again later.",
        loading: false,
      });
    }
  }

  // Handle returning an item
  handleReturnItem = async (orderId) => {
    try {
      // Uncomment below to enable return functionality
      // const response = await axios.post(`http://localhost:3000/orders/return/${orderId}`);
      // if (response.status === 200) {
      //   this.setState({ orders: this.state.orders.filter((order) => order._id !== orderId) });
      // }
    } catch (error) {
      alert("Failed to return item. Try again later.");
    }
  };

  render() {
    const { orders, loading, error, isLoggedIn } = this.state;

    // Redirect to home if not logged in
    if (isLoggedIn) {
      // return <Navigate to="/" />;
    }

    // Loading state
    if (loading) {
      return (
        <div className="p-4 bg-gray-100 rounded-2xl shadow-md max-w-sm mx-auto text-center mt-24">
          <p className="text-blue-500">Loading orders...</p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="p-4 bg-red-100 rounded-2xl shadow-md max-w-sm mx-auto text-center mt-24">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <div className="App min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-md w-full">
          <div className="container">
            <Link className="navbar-brand" to="/home">
              Community Lending App
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={() => localStorage.clear() && this.setState({ isLoggedIn: false })}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Orders Content */}
        <div className="container" style={{ paddingTop: "100px" }}>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">My Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="row">
              {orders.map((item) => (
                <div key={item._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                <div
                    className="p-6 bg-white rounded-3xl shadow-xl hover:shadow-lg transition transform text-left"
                    style={{ padding: "20px", borderRadius: "5px" }}
                >
                    <h3 className="font-semibold text-lg text-gray-800">
                    {item.itemName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                    {item.itemDescription}
                    </p>
                    <p className="text-sm text-gray-700 font-medium mb-1">
                    💰 Price: ${item.itemPrice}
                    </p>
                    <p className="text-sm text-yellow-500 font-medium mb-3">
                        Borrow date: {item.borrowedAt} 
                    </p>
                    <p className="text-sm text-yellow-500 font-medium mb-3">
                        Owner details: {item.ownerName} ({item.ownerEmail})
                    </p>
                </div>
                </div>

              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Orders;
