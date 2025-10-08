import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        
        {/* Ruta detalle de laboratorio */}
        <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
