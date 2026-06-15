import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { formatTitleCase } from "../utils/formatters";

function UserHome() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [appointments, setAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [historyMessage, setHistoryMessage] = useState("");
  const [clearingHistory, setClearingHistory] = useState(false);

  const loadDashboard = async () => {
    try {
      const [userRes, appointmentsRes, notificationsRes] = await Promise.all([
        API.post("/user/getuserdata"),
        API.get("/user/getuserappointments"),
        API.get("/user/getallnotification"),
      ]);

      setUser(userRes.data.data);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userRes.data.data._id,
          fullName: userRes.data.data.fullName,
          email: userRes.data.data.email,
          isDoctor: userRes.data.data.isDoctor,
          type: userRes.data.data.type,
        })
      );
      setAppointments(appointmentsRes.data.appointments || []);
      setNotifications(notificationsRes.data.notification || []);

      if (userRes.data.data.isDoctor) {
        const doctorRes = await API.get("/doctor/getdoctorappointments");
        setDoctorAppointments(doctorRes.data.appointments || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard.");
    }
  };

  const updateDoctorStatus = async (appointmentId, status) => {
    await API.post("/doctor/handlestatus", { appointmentId, status });
    await loadDashboard();
  };

  const clearAppointmentHistory = async () => {
    setHistoryMessage("");
    setClearingHistory(true);

    try {
      const res = await API.delete("/user/clearappointmenthistory");
      await loadDashboard();
      setHistoryMessage(
        res.data.deletedCount
          ? `${res.data.deletedCount} appointment${res.data.deletedCount === 1 ? "" : "s"} removed from history.`
          : "No completed, cancelled, or rejected appointments to clear."
      );
    } catch (err) {
      setHistoryMessage(err.response?.data?.message || "Unable to clear appointment history.");
    } finally {
      setClearingHistory(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingAppointments = appointments.filter((item) => item.status === "pending").length;
  const historyAppointments = appointments.filter((item) =>
    ["cancelled", "completed", "rejected"].includes(item.status)
  );

  return (
    <AppShell title="Dashboard" user={user}>
      {error && <div className="alert-inline error">{error}</div>}

      <div className="page-head">
        <div>
          <h2>Hello, {user?.fullName || "there"}</h2>
          <p>Manage appointments, notifications, and your doctor application from here.</p>
        </div>
      </div>

      <div className="grid cols-3 mb-4">
        <div className="stat-card">
          <span>Total appointments</span>
          <strong>{appointments.length}</strong>
        </div>
        <div className="stat-card">
          <span>Pending appointments</span>
          <strong>{pendingAppointments}</strong>
        </div>
        <div className="stat-card">
          <span>Unread notifications</span>
          <strong>{notifications.length}</strong>
        </div>
      </div>

      <div className="grid cols-2">
        <section className="panel">
          <h3>Profile</h3>
          <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
          <p className="mb-1"><strong>Phone:</strong> {user?.phone || "Not added"}</p>
          <p className="mb-0"><strong>Doctor account:</strong> {user?.isDoctor ? "Approved" : "Not approved"}</p>
        </section>

        <section className="panel">
          <div className="panel-title-row">
            <h3>Recent appointments</h3>
            <button
              className="secondary-btn"
              disabled={!historyAppointments.length || clearingHistory}
              onClick={clearAppointmentHistory}
            >
              {clearingHistory ? "Clearing..." : "Clear history"}
            </button>
          </div>

          {historyMessage && (
            <div className={`alert-inline ${historyMessage.includes("Unable") ? "error" : "success"}`}>
              {historyMessage}
            </div>
          )}

          {appointments.slice(0, 4).length ? (
            appointments.slice(0, 4).map((item) => (
              <div className="d-flex justify-content-between border-bottom py-2" key={item._id}>
                <span>{item.doctorName || item.doctorInfo?.fullName}</span>
                <span className={`badge-soft ${item.status}`}>{formatTitleCase(item.status)}</span>
              </div>
            ))
          ) : (
            <p className="empty-state">No appointments yet.</p>
          )}
        </section>
      </div>

      {user?.isDoctor && (
        <section className="panel mt-4">
          <div className="page-head">
            <div>
              <h2>Doctor appointment requests</h2>
              <p>Approve, reject, or complete patient appointments.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorAppointments.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userInfo?.fullName || "Patient"}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td><span className={`badge-soft ${item.status}`}>{formatTitleCase(item.status)}</span></td>
                    <td>
                      <div className="actions">
                        <button className="secondary-btn" disabled={item.status !== "pending"} onClick={() => updateDoctorStatus(item._id, "approved")}>Approve</button>
                        <button className="danger-btn" disabled={item.status !== "pending"} onClick={() => updateDoctorStatus(item._id, "rejected")}>Reject</button>
                        <button className="primary-btn" disabled={item.status !== "approved"} onClick={() => updateDoctorStatus(item._id, "completed")}>Complete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!doctorAppointments.length && <p className="empty-state">No doctor appointments assigned.</p>}
          </div>
        </section>
      )}

    </AppShell>
  );
}

export default UserHome;
