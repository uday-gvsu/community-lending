import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from 'react-router-dom';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      redirect: false,
      loggedIn: false,
      errorMessage: "", 
    };

    // Bind methods to 'this'
    this.handleChange = this.handleChange.bind(this);
    this.callSignup = this.callSignup.bind(this);
  }

  componentDidMount() {
    const loggedIn = localStorage.getItem("loggedIn"); // Check for token
    if (loggedIn) {
      this.setState({ loggedIn });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, errorMessage: "" }); // Clear error on input change
  }

  async callSignup(event) {
    event.preventDefault();
    const { firstName, lastName, email, password } = this.state;
    const body = { firstName, lastName, email, password };

    try {
      // API call to backend
      const response = await axios.post("http://localhost:3000/register", body);
      console.log("Data sent successfully:", response.data);

      if (response.status === 201) {
        // Redirect to home after success
        localStorage.setItem("loggedIn", true);
        this.setState({ redirect: true });
      }
    } catch (error) {
      console.error("Error sending data:", error);

      // Handle different error cases
      if (error.response) {
        // Backend returned an error response
        this.setState({
          errorMessage:
            error.response.data.message || "An error occurred during registration.",
        });
      } else if (error.request) {
        // No response from server
        this.setState({
          errorMessage: "No response from the server. Please try again later.",
        });
      } else {
        // Other errors
        this.setState({
          errorMessage: "Something went wrong. Please try again.",
        });
      }
    }
  }

  render() {
    const { firstName, lastName, email, password, redirect, errorMessage, loggedIn } = this.state;

    // Redirect to home if successful
    if (redirect || loggedIn) {
      return <Navigate to="/home" />;
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
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/sign-in"}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/sign-up"}>
                      Sign up
                    </Link>
                  </li>
                </>
            </ul>
          </div>
        </div>
      </nav>
      <div className="auth-wrapper">
        <div className="auth-inner">
        <form onSubmit={this.callSignup}>
        <h3>Sign Up</h3>

        {/* Show error message if there's one */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            placeholder="Last name"
            value={lastName}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>

        <p className="forgot-password text-right">
          Already registered? <a href="/sign-in">Sign in</a>
        </p>
      </form>
        </div>
      </div>
    </div>


      
    );
  }
}
