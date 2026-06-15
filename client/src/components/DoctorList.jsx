import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import AppShell from "./AppShell";

function DoctorCard({ doctor, user, onBooked }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const bookAppointment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("doctorId", doctor._id);
    formData.append("userInfo", JSON.stringify(user));
    formData.append("doctorInfo", JSON.stringify(doctor));
    formData.append("date", date);
    formData.append("time", time);
    if (image) formData.append("image", image);

    try {
      const res = await API.post("/user/getappointment", formData);
      setMessage(res.data.message || "Appointment booked.");
      setBookingOpen(false);
      setDate("");
      setTime("");
      setImage(null);
      onBooked?.();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Booking failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="doctor-card">
      <div>
        <h3>{doctor.fullName}</h3>
        <p className="muted mb-1">{doctor.specialization}</p>
        <span className={`badge-soft ${doctor.status}`}>{doctor.status}</span>
      </div>
      <p className="mb-0">{doctor.experience} years experience</p>
      <p className="mb-0">Fee: Rs. {doctor.feesPerConsultation}</p>
      <p className="muted mb-0">{doctor.address}</p>
      {doctor.timings?.length ? <p className="muted mb-0">Timings: {doctor.timings.join(", ")}</p> : null}

      {message && <div className={`alert-inline ${message.includes("failed") ? "error" : "success"}`}>{message}</div>}

      {!bookingOpen ? (
        <button className="primary-btn" onClick={() => setBookingOpen(true)}>
          Book appointment
        </button>
      ) : (
        <form className="booking-form" onSubmit={bookAppointment}>
          <div className="field mb-0">
            <label>Date</label>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </div>
          <div className="field mb-0">
            <label>Time</label>
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
          </div>
          <div className="field mb-0">
            <label>Medical document</label>
            <input type="file" accept="image/*,.pdf" onChange={(event) => setImage(event.target.files?.[0] || null)} />
          </div>
          <div className="actions">
            <button className="primary-btn" disabled={loading} type="submit">
              {loading ? "Booking..." : "Confirm"}
            </button>
            <button className="secondary-btn" type="button" onClick={() => setBookingOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

function DoctorList() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    try {
      const [userRes, doctorsRes] = await Promise.all([
        API.post("/user/getuserdata"),
        API.get("/user/getalldoctors"),
      ]);
      setUser(userRes.data.data);
      setDoctors(doctorsRes.data.doctors || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load doctors.");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) =>
      [doctor.fullName, doctor.specialization, doctor.address]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [doctors, search]);

  return (
    <AppShell title="Doctors" user={user}>
      <div className="page-head">
        <div>
          <h2>Find a doctor</h2>
          <p>{filteredDoctors.length} approved doctor{filteredDoctors.length === 1 ? "" : "s"} available.</p>
        </div>
      </div>

      {error && <div className="alert-inline error">{error}</div>}

      <div className="toolbar">
        <input placeholder="Search by name, specialization, or address" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="grid cols-3">
        {filteredDoctors.map((doctor) => (
          <DoctorCard doctor={doctor} user={user} key={doctor._id} onBooked={loadDoctors} />
        ))}
      </div>

      {!filteredDoctors.length && <p className="empty-state">No approved doctors found.</p>}
    </AppShell>
  );
}

export default DoctorList;
