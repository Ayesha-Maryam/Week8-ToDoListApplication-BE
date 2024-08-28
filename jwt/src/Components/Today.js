import React, { useState } from "react";

export default function Today() {
    const [show, setShow]=useState(false)
  return (
    <div>
      <div className="tasks">
        {task.length > 0 ? (
          task.map((t) => (
            <div className="task" key={t._id}>
              <div className="details-status">
                <div className="details">
                  <input
                    type="checkbox"
                    checked={t.status === "completed"}
                    onChange={() => handleCheckboxChange(t)}
                  />
                  <h3 className={t.status === "completed" ? "strike" : ""} onClick={()=>setShow(!show)}>
                    {t.title}
                  </h3>
                </div>
                <div className="status-btn">
                  <button className="status">{t.status}</button>
                  <div>
                    <button className="edit-btn" onClick={() => handleEdit(t)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
}
