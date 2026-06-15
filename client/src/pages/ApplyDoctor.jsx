import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";

function ApplyDoctor() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    feesPerConsultation: "",
    timings: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const res = await API.post("/user/getuserdata");
      setUser(res.data.data);
      setFormData((current) => ({
        ...current,
        fullName: res.data.data.fullName || "",
        email: res.data.data.email || "",
        phone: res.data.data.phone || "",
      }));
    };

    loadUser();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        feesPerConsultation: Number(formData.feesPerConsultation),
        timings: formData.timings
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const res = await API.post("/user/registerdoc", payload);
      setMessage(res.data.message || "Doctor application submitted.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Doctor application failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Apply as Doctor" user={user}>
      <div className="page-head">
        <div>
          <h2>Doctor application</h2>
          <p>Submit your profile for admin approval.</p>
        </div>
      </div>

      {message && <div className={`alert-inline ${message.includes("failed") || message.includes("exists") ? "error" : "success"}`}>{message}</div>}

      <form className="panel" onSubmit={submitApplication}>
        <div className="grid cols-2">
          <div className="field">
            <label>Full name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Specialization</label>
            <input name="specialization" value={formData.specialization} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Experience</label>
            <input name="experience" value={formData.experience} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Fees per consultation</label>
            <input name="feesPerConsultation" type="number" min="0" value={formData.feesPerConsultation} onChange={handleChange} required />
          </div>
        </div>
        <div className="field">
          <label>Timings</label>
          <input name="timings" placeholder="Mon-Fri 10 AM - 2 PM, Sat 11 AM - 1 PM" value={formData.timings} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Clinic address</label>
          <textarea name="address" rows="3" value={formData.address} onChange={handleChange} required />
        </div>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </AppShell>
  );
}

export default ApplyDoctor;
