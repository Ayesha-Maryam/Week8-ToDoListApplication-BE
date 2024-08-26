import axios from 'axios'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from "react-router-dom";
import image from "./image.png";
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css'


export default function SignUp({username, setName, password, setPassword}) {
    
    const handleSignUp=async(e)=>
    {
        e.preventDefault();
        try{
            await axios.post('http://localhost:8000/signup',
                {
                    username: username,
                    password: password
                }, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                  }
            )
            toast.success("Sign up successfully")
            console.log("Sign up successfully")
        }
        catch(error)
        {
            toast.error("Sign up Failed")
            console.log(error.message)
        }
    }

  return (
    <div className="container">
    <div className="signup">
      <div className="left-container">
        <h3>Start your journey with us</h3>
        <img src={image} />
      </div>
      <div className="right-container">
        <div className="form-content">
          <h3>Sign up</h3>
          <Link to="/login">Already have an account?</Link>
          <form onSubmit={handleSignUp}>
            <div className="inputs">
            <input type="text" value={username} placeholder='Enter name' onChange={(e)=>setName(e.target.value)}/>
        
              <br />
              <input type="password" value={password} placeholder='Enter password' onChange={(e)=>setPassword(e.target.value)}/>
              <br />
            </div>
            <button className="btn" type="submit">
              SignUp
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  </div>
);

}
  