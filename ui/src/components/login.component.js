import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      redirect: false,
      loggedIn: false
    };

    // Bind methods to 'this'
    this.handleChange = this.handleChange.bind(this);
    this.callLogin = this.callLogin.bind(this);
  }

  
  componentDidMount() {
      const loggedIn = localStorage.getItem("loggedIn"); // Check for token
      if (loggedIn != this.state.loggedIn) {
        this.setState({ loggedIn });
      }
    }

  // Handle input change and update state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, errorMessage: "" });
  }

  // Handle login API call
  async callLogin(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const body = { email, password };

    try {
      // Call the login API
      const response = await axios.post("http://localhost:3000/login", body);
      console.log("Login successful:", response.data);

      // If login is successful, redirect to home
      if (response.status === 201) {
        localStorage.setItem("loggedIn", true);
        this.setState({ redirect: true });
      }
    } catch (error) {
      console.error("Error during login:", error);

      // Handle error responses
      if (error.response) {
        // Show specific error from backend if available
        this.setState({
          errorMessage:
            error.response.data.message || "Invalid email or password.",
        });
      } else if (error.request) {
        // No response from server
        this.setState({
          errorMessage: "No response from server. Please try again later.",
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
    const { email, password, errorMessage, redirect, loggedIn } = this.state;

    // Redirect to home if login is successful
    if (redirect || loggedIn) {
      return <Navigate to="/home" />;
    }

    return (
      <form onSubmit={this.callLogin}>
        <h3>Sign In</h3>

        {/* Show error message if any */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="mb-3">
          <label>Email</label>
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
            Submit
          </button>
        </div>

        <p className="forgot-password text-right">
          New here? <a href="/sign-up">Sign up</a>
        </p>
      </form>
    );
  }
}