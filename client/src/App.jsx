import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./styles/App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";
import ApplyDoctor from "./pages/ApplyDoctor";
import UserAppointments from "./pages/UserAppointments";
import Notification from "./pages/Notification";
import DeleteAccount from "./pages/DeleteAccount";
import DoctorList from "./components/DoctorList";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.type !== "admin") {
    return <Navigate to="/userhome" replace />;
  }

  return children;
}

function App() {
  const token =
    localStorage.getItem("token");
  const user = getStoredUser();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to={user?.type === "admin" ? "/adminhome" : "/userhome"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/userhome"
        element={
          <ProtectedRoute>
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <DoctorList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <UserAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-doctor"
        element={
          <ProtectedRoute>
            <ApplyDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/delete-account"
        element={
          <ProtectedRoute>
            <DeleteAccount />
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminhome"
        element={
          <ProtectedRoute adminOnly>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
