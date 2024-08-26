import { useState } from "react";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp
        username={username}
        setName={setName}
        password={password}
        setPassword={setPassword}
        accessToken={accessToken}
        refreshToken={refreshToken}
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
      />}/>
      
      <Route path="/login" element={
      <Login  
      username={username}
        setName={setName}
        password={password}
        setPassword={setPassword}
        accessToken={accessToken}
        refreshToken={refreshToken}
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}/>}/>

      </Routes>
      
    </div>
  );
}

export default App;
