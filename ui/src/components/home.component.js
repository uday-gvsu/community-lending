// src/components/ItemList.jsx
import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: null,
      isLoggedIn: false,
      redirectToCheckout: false,
      selectedItem: null,
    };
  }

  handleLogout = () => {
    localStorage.removeItem("loggedIn");
    this.setState({ isLoggedIn: false });
  };

  // Fetch items from API after component mounts
  async componentDidMount() {
    const isLoggedIn = localStorage.getItem("loggedIn"); // Check for token
    if (!isLoggedIn) {
      this.setState({ isLoggedIn });
    }

    try {
      const response = await axios.get("http://localhost:3000/items");
      this.setState({
        items: response.data.slice(0, 10), // Limit to 10 items
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: "Error fetching items. Please try again later.",
        loading: false,
      });
    }
  }

  // Handle checkout and navigate to checkout page
  handleCheckout = (item) => {
    this.setState({
      selectedItem: item,
      redirectToCheckout: true,
    });
    sessionStorage.setItem('item', JSON.stringify(item));
  };

  render() {
    const { items, loading, error, isLoggedIn, redirectToCheckout, selectedItem } =
      this.state;

    // Redirect to checkout page with selected item
    if (redirectToCheckout && selectedItem) {
      return (
        <Navigate
          to="/checkout"
          state={{ item: selectedItem }} // Pass selected item data to checkout page
        />
      );
    }

    // Redirect to home if not logged in
    if (isLoggedIn) {
      return <Navigate to="/" />;
    }

    // Loading state
    if (loading) {
      return (
        <div className="p-4 bg-gray-100 rounded-2xl shadow-md max-w-sm mx-auto text-center mt-24">
          <p className="text-blue-500">Loading items...</p>
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
            <Link className="navbar-brand" to={"/sign-in"}>
              Community Lending App
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link bg-red-500 px-3 py-1 rounded-lg  hover:bg-red-600 transition"
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
        <div
          className="container"
          style={{ paddingTop: "100px" }} // Added padding to prevent overlap
        >
          {items.length === 0 ? (
            <p className="text-gray-500 text-left">No items found.</p>
          ) : (
            <div className="row">
              {items.map((item) => (
                <div key={item._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                  <div
                    className="p-6 bg-white rounded-3xl shadow-xl hover:shadow-lg transition transform text-left"
                    style={{ padding: "20px", borderRadius: "5px" }}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      💰 Price: ${item.price}
                    </p>
                    <p className="text-sm text-yellow-500 font-medium mb-3">
                      ⭐ Rating: {item.rating} / 5
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleCheckout(item)}
                    >
                      Borrow Item
                    </button>
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

export default Home;
