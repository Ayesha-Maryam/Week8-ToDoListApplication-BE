import { useEffect, useState } from "react";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
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
const navigate=useNavigate();
  useEffect(() => {
    async function fetchUsers() {
      let currentUser= JSON.parse(localStorage.getItem('currentUser'));
      try{
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
        if(error.response.status===403)
        {
          currentUser.accessToken= await getRefreshToken(currentUser.refreshToken);
          if(currentUser.accessToken)
          {
            localStorage.setItem("currentUser", JSON.stringify(currentUser))
            return fetchUsers();
          }
          else
          {
            console.log("Access Token not Found")
          }

        }
        toast.error("Access Failed");
        console.log(error.message)
      }
    }
    fetchUsers();
  }, []);


  const getRefreshToken = async (refreshToken) => {
    try {
      console.log("refreshToken", refreshToken)
      const response = await axios.post("http://localhost:8000/users/refreshToken", {
        refreshToken: refreshToken,
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


  const handleLogout=()=>
  {
    localStorage.removeItem("currentUser");
    setUser(null);
    setTask(null);
    navigate("/")
  }

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
          path="/tasks"
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
              handleLogout={handleLogout}
            />
          }
        />
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
