import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext"; // Asegúrate de que la ruta sea correcta
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory"
import Stands from "./pages/Stands"
import AirConditionerControl from "./components/deviceControl/AirConditionerControl";
import LaboratoriesManagement from "./pages/LaboratoriesManagement";
import Estantes3D from "./pages/Estantes3D";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/air" element={<AirConditionerControl />} />
            <Route path="/stands" element={<Stands />} />
            <Route path="/laboratories-management" element={<LaboratoriesManagement />} />
            <Route path="/estante-3d" element={<Estantes3D />} />

            {/* Ruta detalle de laboratorio */}
            <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;