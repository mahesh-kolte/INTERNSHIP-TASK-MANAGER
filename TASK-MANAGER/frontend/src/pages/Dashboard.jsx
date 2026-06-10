  import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTasks();
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await API.post(
        "/tasks",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Created Successfully");

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Error Creating Task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const deleteTask = async (id) => {
  const token = localStorage.getItem("token");

  try {
    await API.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Task Deleted Successfully");

    fetchTasks();
  } catch (error) {
    console.log(error);
    alert("Delete Failed");
  }
};

  return (
    <div className="container">
      <div className="navbar">
        <h1>Task Manager 🚀</h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <h2>No Tasks Found</h2>
        ) : (
          tasks.map((task) => (
            <div
              className="task-card"
              key={task._id}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                Status:
                <strong>
                  {" "}
                  {task.status}
                </strong>
              </p>
              <button
  onClick={() => deleteTask(task._id)}
>
  Delete
</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;