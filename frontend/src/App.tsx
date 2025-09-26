import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Ruta detalle de laboratorio */}
        <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
