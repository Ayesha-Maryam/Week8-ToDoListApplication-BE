import axios from "axios";
import React from "react";
import './SignUp.css'
import { Link, useNavigate } from "react-router-dom";
import image from "./image.png";
import { toast, ToastContainer } from "react-toastify";

export default function Login({
  username,
  setName,
  password,
  setPassword,
  setUser,setTask,
  setAccessToken,
  setRefreshToken,
}) {
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/users/login", {
        username,
        password,
      },
      {
        headers:
        {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }});
      
      if (!response.data) {
        console.log("User Data not Found")
      }

        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.data))
        const _response = await axios.get("http://localhost:8000/tasks",{
          headers:{
            Authorization: `Bearer ${response.data.accessToken}`
          }
        });
        setUser(response.data)
        setTask(_response.data || [])
        toast.success("Login Successful");
        navigate("/tasks")
      
    } catch (error) {
      toast.error("Login Failed");
      console.log(error.message);
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
          <Link to="/">Don't have an account?</Link>
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
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  </div>)}
