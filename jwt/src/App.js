import { useEffect, useState } from "react";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import ShowTodo from "./Components/ShowTodo";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState("");
  const [task, setTask] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      console.log("Access Token:", accessToken);  
      try{
        const currentUser= JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser)
        {
          const response=await axios.get("http://localhost:8000/tasks",{ headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          }},
        );
          setUser(currentUser);
          setTask(response.data || []);
        }
      }
      catch(error)
      {
        console.log(error.message)
      }
    }
    fetchUsers();
  }, []);

  const getRefreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users/refresh-token", {
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
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <SignUp
              username={username}
              setName={setName}
              password={password}
              setPassword={setPassword}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              username={username}
              setName={setName}
              user={user}
              setUser={setUser}
              task={task}
              setTask={setTask}
              password={password}
              setPassword={setPassword}
              accessToken={accessToken}
              refreshToken={refreshToken}
              setAccessToken={setAccessToken}
              setRefreshToken={setRefreshToken}
              getRefreshToken={getRefreshToken}
            />
          }
        />


<Route
          path="/show"
          element={
            <ShowTodo
              username={username}
              setName={setName}
              user={user}
              setUser={setUser}
              task={task}
              setTask={setTask}
              password={password}
              setPassword={setPassword}
              accessToken={accessToken}
              refreshToken={refreshToken}
              setAccessToken={setAccessToken}
              setRefreshToken={setRefreshToken}
              getRefreshToken={getRefreshToken}
            />
          }
        />
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
