import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api";

const PAGE_SIZE = 5;

const Dashboard = ({ token, role, tenantId, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    getProjects(token).then((res) => setProjects(res.data));
    getTasks(token).then((res) => setTasks(res.data));
  }, [token]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    await createProject(token, { name: projectName });
    const res = await getProjects(token);
    setProjects(res.data);
    setProjectName("");
    setProjectPage(1);
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(token, id);
    const res = await getProjects(token);
    setProjects(res.data);
    setProjectPage(1);

    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
      setTaskPage(1);
    }
  };

  const handleCreateTask = async () => {
    if (!taskName.trim()) return;
    if (!projects.length) {
      setInfoMessage("Create a project first before adding tasks.");
      return;
    }
    const projectId = selectedProject ? selectedProject.id : projects[0].id;

    await createTask(token, { project_id: projectId, name: taskName });
    const res = await getTasks(token);
    setTasks(res.data);
    setTaskName("");
    setTaskPage(1);
    setInfoMessage("");
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(token, id);
    const res = await getTasks(token);
    setTasks(res.data);
    setTaskPage(1);
  };

  const handleChangeTaskStatus = async (task, newStatus) => {
    await updateTask(token, task.id, {
      name: task.name,
      description: task.description,
      status: newStatus,
    });
    const res = await getTasks(token);
    setTasks(res.data);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredTasks = tasks
    .filter((t) =>
      t.name.toLowerCase().includes(taskSearch.toLowerCase())
    )
    .filter((t) =>
      selectedProject ? t.project_id === selectedProject.id : true
    );

  const projectTotalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE)
  );
  const taskTotalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / PAGE_SIZE)
  );

  const pagedProjects = filteredProjects.slice(
    (projectPage - 1) * PAGE_SIZE,
    projectPage * PAGE_SIZE
  );
  const pagedTasks = filteredTasks.slice(
    (taskPage - 1) * PAGE_SIZE,
    taskPage * PAGE_SIZE
  );

  const containerStyle = {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    margin: 0,
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "16px 20px",
    marginBottom: "20px",
  };

  const sectionHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  };

  const inputStyle = {
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "8px",
    fontSize: "14px",
  };

  const buttonPrimaryStyle = {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
    marginLeft: "8px",
  };

  const buttonDangerStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontSize: "12px",
    cursor: "pointer",
    marginLeft: "8px",
  };

  const pagerButtonStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    fontSize: "12px",
    cursor: "pointer",
    margin: "0 4px",
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0",
    borderBottom: "1px solid #f1f1f1",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ ...sectionHeaderStyle, marginBottom: 0 }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: "4px" }}>Dashboard</h1>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Multi-tenant project and task management
            </p>
            {(role || tenantId) && (
              <p style={{ margin: 0, color: "#9ca3af", fontSize: "12px" }}>
                Role: {role || "unknown"} | Tenant: {tenantId || "unknown"}
              </p>
            )}
          </div>
          {onLogout && (
            <button
              style={buttonDangerStyle}
              type="button"
              onClick={onLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {infoMessage && (
        <div
          style={{
            marginBottom: "10px",
            color: "#2563eb",
            fontSize: "13px",
          }}
        >
          {infoMessage}
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ marginBottom: "12px" }}>
          <input
            style={inputStyle}
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button style={buttonPrimaryStyle} onClick={handleCreateProject}>
            Create Project
          </button>
        </div>
        <div>
          <input
            style={inputStyle}
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button style={buttonPrimaryStyle} onClick={handleCreateTask}>
            Create Task
          </button>
        </div>
      </div>

      {/* Projects */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <input
            style={inputStyle}
            placeholder="Search projects"
            value={projectSearch}
            onChange={(e) => {
              setProjectSearch(e.target.value);
              setProjectPage(1);
            }}
          />
        </div>
        {pagedProjects.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            No projects found.
          </p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {pagedProjects.map((p) => (
              <li key={p.id} style={listItemStyle}>
                <span>{p.name}</span>
                <div>
                  <button
                    style={buttonPrimaryStyle}
                    onClick={() => {
                      setSelectedProject(p);
                      setTaskPage(1);
                    }}
                  >
                    View Tasks
                  </button>
                  <button
                    style={buttonDangerStyle}
                    onClick={() => handleDeleteProject(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <button
            style={pagerButtonStyle}
            disabled={projectPage === 1}
            onClick={() => setProjectPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span style={{ fontSize: "12px", color: "#4b5563" }}>
            Page {projectPage} of {projectTotalPages}
          </span>
          <button
            style={pagerButtonStyle}
            disabled={projectPage === projectTotalPages}
            onClick={() =>
              setProjectPage((p) => Math.min(projectTotalPages, p + 1))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ margin: 0 }}>
            Tasks {selectedProject ? `for ${selectedProject.name}` : ""}
          </h2>
          <input
            style={inputStyle}
            placeholder="Search tasks"
            value={taskSearch}
            onChange={(e) => {
              setTaskSearch(e.target.value);
              setTaskPage(1);
            }}
          />
        </div>
        {pagedTasks.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>No tasks found.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {pagedTasks.map((t) => (
              <li key={t.id} style={listItemStyle}>
                <span>{t.name}</span>
                <div>
                  <select
                    value={t.status || "PENDING"}
                    onChange={(e) =>
                      handleChangeTaskStatus(t, e.target.value)
                    }
                    style={{ marginRight: "8px" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button
                    style={buttonDangerStyle}
                    onClick={() => handleDeleteTask(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <button
            style={pagerButtonStyle}
            disabled={taskPage === 1}
            onClick={() => setTaskPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span style={{ fontSize: "12px", color: "#4b5563" }}>
            Page {taskPage} of {taskTotalPages}
          </span>
          <button
            style={pagerButtonStyle}
            disabled={taskPage === taskTotalPages}
            onClick={() =>
              setTaskPage((p) => Math.min(taskTotalPages, p + 1))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
