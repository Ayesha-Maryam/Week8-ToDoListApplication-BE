import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import './ShowTodo.css'

export default function ShowTodo({ accessToken, user, task, setTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  useEffect(() => {
    async function fetchTask() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const response = await axios.get("http://localhost:8000/tasks", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });
        setTask(response.data);
        console.log("Task 1st fetched", response.data);
        console.log("Current User Token", currentUser.accessToken);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchTask();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await axios.post(
        "http://localhost:8000/tasks",
        {
          title,
          description,
          status,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      const _response = await axios.get("http://localhost:8000/tasks", {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      if (_response) {
        setTask(_response.data);
        console.log(task);
        toast.success("Task added Successfully.");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="container2"> 
      <div className="heading">
        <h1>Todo List</h1>
      </div>
      <div>
        <input type="search" placeholder="Search" />
        <button type="button">Search</button>
        <div>
          <form onSubmit={(e) => addTask(e)}>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              type="date"
              placeholder="Enter Due Date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
            />
            <button type="submit">Add Task</button>
          </form>
        </div>

        <div className="tasks">
          {task.length > 0 ? (
            task.map((t) => (
              <div className="task" key={t._id}>
                <div className="details-status">
                  <div className="details">
                    <h3>{t.title}</h3>
                    <p>{t.description}</p>
                    <p>{t.dueDate}</p>
                  </div>
                  <div className="status-btn">
                    <button className="status">{t.status}</button>
                  {/* <button className="pendingstatus">{t.status==="pending"? "Pending" : 0}</button>
                  <button className="completedstatus">{t.status==="completed"? "Completed": 0}</button> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
