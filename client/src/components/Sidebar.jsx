import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const patientItems = [
  { label: "Dashboard", path: "/userhome" },
  { label: "Doctors", path: "/doctors" },
  { label: "Appointments", path: "/appointments" },
  { label: "Notifications", path: "/notifications" },
  { label: "Apply as Doctor", path: "/apply-doctor" },
];

const adminItems = [{ label: "Admin Dashboard", path: "/adminhome" }];

function initials(name = "User") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = user?.type === "admin" ? adminItems : patientItems;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <button className="sidebar-brand nav-link-btn" onClick={() => navigate("/")}>
        <Logo />
      </button>

      <div className="sidebar-user">
        <strong>{user?.fullName || "Arogya user"}</strong>
        <span>{user?.type === "admin" ? "Administrator" : user?.isDoctor ? "Doctor" : "Patient"}</span>
        <span>{initials(user?.fullName)}</span>
      </div>

      <nav className="nav-list">
        {items.map((item) => (
          <button
            className={`nav-link-btn ${location.pathname === item.path ? "active" : ""}`}
            key={item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {user?.type !== "admin" && (
        <button
          className={`delete-account-link ${location.pathname === "/delete-account" ? "active" : ""}`}
          onClick={() => navigate("/delete-account")}
        >
          Delete account
        </button>
      )}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
