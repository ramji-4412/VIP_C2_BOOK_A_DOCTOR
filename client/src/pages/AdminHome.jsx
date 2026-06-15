import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { formatTitleCase } from "../utils/formatters";

function AdminHome() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingDoctors: 0,
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors");
  const [error, setError] = useState("");

  const loadAdmin = async () => {
    try {
      const [userRes, statsRes, usersRes, doctorsRes, appointmentsRes] = await Promise.all([
        API.post("/user/getuserdata"),
        API.get("/admin/dashboardstats"),
        API.get("/admin/getallusers"),
        API.get("/admin/getalldoctors"),
        API.get("/admin/getallappointments"),
      ]);
      setUser(userRes.data.data);
      setStats(statsRes.data.stats || {});
      setUsers(usersRes.data.users || []);
      setDoctors(doctorsRes.data.doctors || []);
      setAppointments(appointmentsRes.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin dashboard.");
    }
  };

  const updateDoctor = async (doctorId, action) => {
    await API.post(action === "approve" ? "/admin/getapprove" : "/admin/getreject", { doctorId });
    await loadAdmin();
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  return (
    <AppShell title="Admin Dashboard" user={user}>
      <div className="page-head">
        <div>
          <h2>Administration</h2>
          <p>Review users, doctors, approvals, and appointment activity.</p>
        </div>
      </div>

      {error && <div className="alert-inline error">{error}</div>}

      <div className="grid cols-4 mb-4">
        <div className="stat-card"><span>Users</span><strong>{stats.totalUsers || 0}</strong></div>
        <div className="stat-card"><span>Doctors</span><strong>{stats.totalDoctors || 0}</strong></div>
        <div className="stat-card"><span>Appointments</span><strong>{stats.totalAppointments || 0}</strong></div>
        <div className="stat-card"><span>Pending doctors</span><strong>{stats.pendingDoctors || 0}</strong></div>
      </div>

      <div className="toolbar">
        <button className={activeTab === "doctors" ? "primary-btn" : "secondary-btn"} onClick={() => setActiveTab("doctors")}>Doctors</button>
        <button className={activeTab === "users" ? "primary-btn" : "secondary-btn"} onClick={() => setActiveTab("users")}>Users</button>
        <button className={activeTab === "appointments" ? "primary-btn" : "secondary-btn"} onClick={() => setActiveTab("appointments")}>Appointments</button>
      </div>

      {activeTab === "doctors" && (
        <section className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.specialization}</td>
                  <td>Rs. {doctor.feesPerConsultation}</td>
                  <td><span className={`badge-soft ${doctor.status}`}>{formatTitleCase(doctor.status)}</span></td>
                  <td>{doctor.email}<br /><span className="muted">{doctor.phone}</span></td>
                  <td>
                    <div className="actions">
                      <button className="secondary-btn" disabled={doctor.status === "approved"} onClick={() => updateDoctor(doctor._id, "approve")}>Approve</button>
                      <button className="danger-btn" disabled={doctor.status === "rejected"} onClick={() => updateDoctor(doctor._id, "reject")}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!doctors.length && <p className="empty-state">No doctor applications found.</p>}
        </section>
      )}

      {activeTab === "users" && (
        <section className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || "-"}</td>
                  <td>{formatTitleCase(item.type)}</td>
                  <td>{item.isDoctor ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="empty-state">No users found.</p>}
        </section>
      )}

      {activeTab === "appointments" && (
        <section className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item._id}>
                  <td>{item.userInfo?.fullName || "Patient"}</td>
                  <td>{item.doctorInfo?.fullName || "Doctor"}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td><span className={`badge-soft ${item.status}`}>{formatTitleCase(item.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!appointments.length && <p className="empty-state">No appointments found.</p>}
        </section>
      )}
    </AppShell>
  );
}

export default AdminHome;
