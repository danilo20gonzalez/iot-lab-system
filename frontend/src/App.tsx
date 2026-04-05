import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Laboratory from "./pages/Laboratory";
import LaboratoriesManagement from "./pages/LaboratoriesManagement";
import Project from "./pages/Projects";
import Stand from "./pages/Stands";
import Row from "./pages/Rows";

import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route path="/laboratories-management" element={<LaboratoriesManagement />} />
            <Route path="/project" element={<Project />} />
            <Route path="/stand" element={<Stand />} />
            <Route path="/row" element={<Row />} />

            {/* Ruta detalle de laboratorio */}
            <Route path="/laboratorios/:id" element={<h1>Detalle de laboratorio</h1>} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;