// src/components/ItemList.jsx
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: null,
      isLoggedIn: false
    };
    
  }

  handleLogout() {
    localStorage.removeItem("loggedIn");
    this.setState({isLoggedIn: false})
  }

  // Fetch items from API after component mounts
  async componentDidMount() {
    const isLoggedIn = localStorage.getItem("loggedIn"); // Check for token
    if (isLoggedIn) {
      this.setState({ isLoggedIn });
    }

    try {
      const response = await axios.get('http://localhost:3000/items');
      this.setState({
        items: response.data.slice(0, 10), // Limit to 10 items
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Error fetching items. Please try again later.',
        loading: false,
      });
    }
  }

  render() {
    const { items, loading, error, isLoggedIn} = this.state;

    // Redirect to home if login is successful
    if (!isLoggedIn) {
      return <Navigate to="/home" />;
    }

    // Loading state
    if (loading) {
      return (
        <div className="p-4 bg-gray-100 rounded-2xl shadow-md max-w-lg mx-auto text-center">
          <p className="text-blue-500">Loading items...</p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="p-4 bg-red-100 rounded-2xl shadow-md max-w-lg mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
        <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>
              Community Lending App
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ms-auto">
              {
                <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </li>
              }
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
          <div className="p-4 bg-gray-100 rounded-2xl shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Item List</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}xr
                className="bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-600">{item.price}</p>
                <p className="text-sm text-gray-600">{item.rating}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
          </div>
        </div>
      </div>
      
    );
  }
}

export default Home;
