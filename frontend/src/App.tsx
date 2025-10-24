import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory"
import Project from "./pages/Projects"
import Stand from "./pages/Stands"
import Row from "./pages/Rows"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/laboratory" element={<Laboratory/>} />
        <Route path="/project" element={<Project/>} />
        <Route path="/stand" element={<Stand/>} />
        <Route path="/row" element={<Row/>} />
        
        {/* Ruta detalle de laboratorio */}
        <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
