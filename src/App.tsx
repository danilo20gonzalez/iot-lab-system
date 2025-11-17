import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ComponentProvider } from "./components/ComponentContext"; // Asegúrate de que la ruta sea correcta
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory"
import Stands from "./pages/Stands"
import AirConditionerControl from "./components/deviceControl/AirConditionerControl";
import LaboratoriesManagement from "./pages/LaboratoriesManagement";

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
          <Route path="/stands" element={<Stands/>} />
          <Route path="/laboratories-management" element={<LaboratoriesManagement/>} />
          
          {/* Ruta detalle de laboratorio */}
          <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
        </Routes>
      </Router>
    </ComponentProvider>
  );
}

export default App;