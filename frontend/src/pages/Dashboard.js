import React, { useEffect, useState } from "react";
import { getProjects, createProject, getTasks, createTask } from "../api";

const Dashboard = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskName, setTaskName] = useState("");
  
  useEffect(() => {
    getProjects(token).then(res => setProjects(res.data));
    getTasks(token).then(res => setTasks(res.data));
  }, [token]);

  const handleCreateProject = async () => {
    await createProject(token, { name: projectName });
    const res = await getProjects(token);
    setProjects(res.data);
  };

  const handleCreateTask = async () => {
    if (!projects.length) return alert("Create a project first");
    await createTask(token, { project_id: projects[0].id, name: taskName });
    const res = await getTasks(token);
    setTasks(res.data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <input placeholder="Project Name" value={projectName} onChange={e=>setProjectName(e.target.value)} />
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <div>
        <input placeholder="Task Name" value={taskName} onChange={e=>setTaskName(e.target.value)} />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>
      <h3>Projects</h3>
      <ul>{projects.map(p=><li key={p.id}>{p.name}</li>)}</ul>
      <h3>Tasks</h3>
      <ul>{tasks.map(t=><li key={t.id}>{t.name}</li>)}</ul>
    </div>
  );
};

export default Dashboard;
