import axios from "axios";
import React from "react";
import './SignUp.css'
import { Link } from "react-router-dom";
import image from "./image.png";
import { toast, ToastContainer } from "react-toastify";

export default function Login({
  username,
  setName,
  password,
  setPassword,
  accessToken,
  setAccessToken,
  refreshToken,
  setRefreshToken,
}) {
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        toast.success("Login Successful");
      }
    } catch (error) {
      toast.error("Login Failed");
      console.log(error.message);
    }
  };
  const handleProtected = async () => {
    try {
      const response = await axios.get("http://localhost:8000/protected", {
        headers: { Authorization: `Bearer: ${accessToken}` },
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error.response.status === 403) {
        const newAccessToken = await getRefreshToken();
        if (newAccessToken) {
          return handleProtected();
        }
      }
      toast.error("Access Failed");
    }
  };

  const getRefreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/refresh-token", {
        refreshToken,
      });
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      } else {
        toast.error("Session Expired");
        return null;
      }
    } catch (error) {
      toast.error("Failed to Refresh Token");
      return null;
    }
  };
  return (
    <div className="container">
    <div className="signup">
      <div className="left-container">
        <h3>Start your journey with us</h3>
        <img src={image} />
      </div>
      <div className="right-container">
        <div className="form-content">
          <h3>Login</h3>
          <Link to="/signup">Don't have an account?</Link>
          <form onSubmit={handleLogin}>
            <div className="inputs">
            <input
            value={username}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        
              <br />
              <input
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          /> <br />
            </div>
            <div className="btn-flex">
            <div >
            <button className="btn" type="submit">
              Login
            </button>
            </div>
            <div>
            <button className="btn" onClick={handleProtected}>Access Routes</button>
            </div>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  </div>)}
