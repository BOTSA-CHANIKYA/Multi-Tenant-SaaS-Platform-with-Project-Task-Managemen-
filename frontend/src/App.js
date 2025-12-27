import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [tenantId, setTenantId] = useState(() =>
    localStorage.getItem("tenantId")
  );

  const handleSetToken = (newToken, user) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    const newRole = user?.role || null;
    const newTenantId = user?.tenantId || null;

    setRole(newRole);
    setTenantId(newTenantId);

    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");

    if (newTenantId) localStorage.setItem("tenantId", newTenantId);
    else localStorage.removeItem("tenantId");
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setTenantId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("tenantId");
  };

  return token ? (
    <Dashboard token={token} role={role} tenantId={tenantId} onLogout={handleLogout} />
  ) : (
    <Login setToken={handleSetToken} />
  );
}

export default App;
