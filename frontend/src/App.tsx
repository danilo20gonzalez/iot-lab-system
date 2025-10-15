import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/laboratory" element={<Laboratory/>} />
        
        {/* Ruta detalle de laboratorio */}
        <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
