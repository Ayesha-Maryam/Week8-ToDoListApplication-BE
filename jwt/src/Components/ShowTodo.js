import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./ShowTodo.css";
import "./Modal.css";
import profile from "./profile.jpg";
import logout from "./download.png";


export default function ShowTodo({
  task,
  setTask,
  getRefreshToken,
  handleLogout,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedId, setEditedId] = useState(null);
  const [type, setType] = useState("all");
  const [modal, setModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Username", currentUser.user.username);

  useEffect(() => {
    async function fetchTask() {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      try {
        const response = await axios.get("http://localhost:8000/tasks", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        if (error.response.status === 403) {
          currentUser.accessToken = await getRefreshToken(
            currentUser.refreshToken
          );
          if (currentUser.accessToken) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            return fetchTask();
          } else {
            console.log("Access Token not Found");
          }
        }
        toast.error("Access Failed");
        console.log(error.message);
      }
    }
    fetchTask();
  }, []);

  async function addTask(e) {
    e.preventDefault();

    try {
      console.log("Before Adding Task", {
        title,
        description,
        dueDate,
        status,
      });
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
      if (!response) {
        console.log("Cannot get response");
      }
      const _response = await axios.get("http://localhost:8000/tasks", {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      if (_response) {
        setTask(_response.data);
        setModal(!modal);
        toast.success("Task added Successfully.");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleEdit = (t) => {
    setEditedId(t._id);
    setEditedTitle(t.title);
    setEditedDescription(t.description);
    setEditedStatus(t.status);
    setEditedDueDate(t.dueDate);
    setSidebarOpen(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log("Sending update for Task ID:", editedId);
      console.log("Updated Task Data:", {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        dueDate: editedDueDate,
      });
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await axios.put(
        `http://localhost:8000/tasks/${editedId}`,
        {
          title: editedTitle,
          description: editedDescription,
          status: editedStatus,
          dueDate: editedDueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      if (!response) {
        console.log("Error in Updating Task");
      }
      const _response = await axios.get(`http://localhost:8000/tasks`, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      setSidebarOpen(!sidebarOpen);
      setEditedId(null);
      setTask(_response.data);
      toast.success("Updated Successfully.");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (t) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    await axios.delete(`http://localhost:8000/tasks/${t._id}`, {
      headers: {
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });
    const _response = await axios.get(`http://localhost:8000/tasks`, {
      headers: {
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });
    setTask(_response.data);
    setSidebarOpen(!sidebarOpen);
    toast.success("Deleted Successfully.");
  };

  const handleCheckboxChange = async (t) => {
    const updatedStatus = t.status === "pending" ? "completed" : "pending";
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      await axios.put(
        `http://localhost:8000/tasks/${t._id}`,
        {
          ...t,
          status: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      const _response = await axios.get(`http://localhost:8000/tasks`, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      setTask(_response.data);
      toast.success(`Task marked as ${updatedStatus}.`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const filterTask = () => {
    const today = new Date().toISOString().split("T")[0];
    switch (type) {
      case "today":
        return task.filter(
          (t) => new Date(t.dueDate).toISOString().split("T")[0] === today
        );
      case "upcoming":
        return task.filter(
          (t) => new Date(t.dueDate).toISOString().split("T")[0] > today
        );
      case "pending":
        return task.filter((t) => t.status === "pending");
      case "completed":
        return task.filter((t) => t.status === "completed");
      case "all":
        return task;
      default:
        return task;
    }
  };

  const handleTaskClick = (t) => {
    setIsEditing(false);
    setSelectedTask(t);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container2">
      <div className="side-panel">
        <div className="img-name">
          <div className="img">
            <img src={profile} />
          </div>
          <div className="name">
            <h2>Do It!</h2>
            <h3>{currentUser.user.username}</h3>
          </div>
        </div>
        <hr className="name-hr" />
        <div className="task-type">
          <p class="circle" style={{ '--circle-color': '#FAC608' }}onClick={() => setType("all")}>All Task</p>
          <p class="circle" style={{ '--circle-color': '#FD99AF' }} onClick={() => setType("today")}>Today's Task</p>
          <p class="circle" style={{ '--circle-color': '#3FD4F4' }} onClick={() => setType("upcoming")}>Upcoming Task</p>
          <p class="circle" style={{ '--circle-color': '#ff6347' }} onClick={() => setType("pending")}>Pending Task</p>
          <p class="circle" style={{ '--circle-color': '#32cd32' }} onClick={() => setType("completed")}>Completed Task</p>
          <hr className="hr-type" />
          <div className="logout">
            <div className="logout-img"><img src={logout}/></div>
            <div className="logout-head"><h3 onClick={handleLogout}>Logout</h3></div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="heading">
          <h1>My Tasks Todo...</h1>
        </div>

        <div className="add-task">
          <h4 onClick={() => setModal(true)}>+ New Task</h4>
        </div>

        <div className="tasks">
          {console.log(task)}
          {filterTask().length > 0 ? (
            filterTask().map((t) => (
              <div className="task" key={t._id}>
                <div className="details">
                  <input
                    type="checkbox"
                    checked={t.status === "completed"}
                    onChange={() => handleCheckboxChange(t)}
                  />
                  <h4
                    className={t.status === "completed" ? "strike" : ""}
                    onClick={() => handleTaskClick(t)}
                  >
                    {t.title}
                  </h4>
                </div>
                <div className="status-btn">
                  <h5 className="status">
                    {new Date(t.dueDate).toISOString().split("T")[0]}
                  </h5>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        {sidebarOpen && selectedTask && (
          <div className="sidebar">
            <button
              className="modal-close"
              onClick={() => setSidebarOpen(false)}
            >
              &times;
            </button>
            <h1> Task Details</h1>
            <hr className="details-hr" />
            {!isEditing ? (
              <div className="sidebar-details">
                <h2>{selectedTask.title}</h2>
                <p>{selectedTask.description}</p>
                <div className="dueDate-des">
                  <p className="head">Due Date: </p>
                  <p>{new Date(selectedTask.dueDate).toISOString().split("T")[0]}</p>
                </div>
                <div className="status-des">
                  <p className="head">Status:</p>
                  <p>{selectedTask.status}</p>
                </div>
                <hr/>
                <div className="sidebar-buttons">
                  <button onClick={() => handleEdit(selectedTask)}>Edit</button>
                  <button onClick={() => handleDelete(selectedTask)}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="sidebar-edit">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <br />
                <textarea
                  value={editedDescription}
                  rows="3"
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <br />
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <br />
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
                <br />
                <hr/>
                <div className="sidebar-buttons">
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {modal == true && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setModal(false)}>
                &times;
              </button>
              <h3>Add Task</h3>
              <form className="add-form" onSubmit={(e) => addTask(e)}>
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
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  placeholder="Enter Due Date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                  }}
                />
                <button className="submit-task-btn" type="submit">
                  Add Task
                </button>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
