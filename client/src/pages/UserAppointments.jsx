import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { formatTitleCase } from "../utils/formatters";

function UserAppointments() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      const [userRes, appointmentsRes] = await Promise.all([
        API.post("/user/getuserdata"),
        API.get("/user/getuserappointments"),
      ]);
      setUser(userRes.data.data);
      setAppointments(appointmentsRes.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load appointments.");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    await API.post("/user/cancelappointment", { appointmentId });
    await loadAppointments();
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <AppShell title="Appointments" user={user}>
      <div className="page-head">
        <div>
          <h2>My appointments</h2>
          <p>Track appointment status and cancel pending requests.</p>
        </div>
      </div>

      {error && <div className="alert-inline error">{error}</div>}

      <section className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item._id}>
                <td>{item.doctorName || item.doctorInfo?.fullName || "Doctor"}</td>
                <td>{item.doctorInfo?.specialization || "-"}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td><span className={`badge-soft ${item.status}`}>{formatTitleCase(item.status)}</span></td>
                <td>{item.document?.originalname || "-"}</td>
                <td>
                  <button
                    className="danger-btn"
                    disabled={["cancelled", "completed", "rejected"].includes(item.status)}
                    onClick={() => cancelAppointment(item._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!appointments.length && <p className="empty-state">No appointments booked yet.</p>}
      </section>
    </AppShell>
  );
}

export default UserAppointments;
