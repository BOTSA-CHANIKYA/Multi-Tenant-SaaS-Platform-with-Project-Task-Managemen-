import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(null);
  return token ? <Dashboard token={token} /> : <Login setToken={setToken} />;
}

export default App;
