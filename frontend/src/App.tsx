import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ComponentProvider } from "./components/ComponentContext"; // Asegúrate de que la ruta sea correcta
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory"
import Stands from "./pages/Stands"
import AirConditionerControl from "./components/deviceControl/AirConditionerControl";
import SmartLightControl from "./components/deviceControl/SmartLightControl";
import LaboratoriesManagement from "./pages/LaboratoriesManagement";
import Estantes3D from "./pages/Estantes3D";

function App() {
  return (
    <ComponentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/laboratory" element={<Laboratory/>} />
          <Route path="/air" element={<AirConditionerControl/>} />
          <Route path="/light" element={<SmartLightControl/>} />
          <Route path="/stands" element={<Stands/>} />
          <Route path="/laboratories-management" element={<LaboratoriesManagement/>} />
          <Route path="/estante-3d" element={<Estantes3D/ >} />
          
          {/* Ruta detalle de laboratorio */}
          <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
        </Routes>
      </Router>
    </ComponentProvider>
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