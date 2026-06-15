import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Logo from "../components/Logo";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/user/register", formData);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <Logo className="auth-logo" />
        <div className="auth-copy">
          <h1>Create your health account.</h1>
          <p>
            Register as a patient first. After login, you can apply to become a
            doctor from your dashboard.
          </p>
        </div>
        <p className="auth-foot">Your account is protected by backend JWT authentication.</p>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2>Register</h2>
          <p className="muted">Use your active email and phone number.</p>

          {error && <div className="alert-inline error">{error}</div>}

          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button className="primary-btn w-100" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="mt-3 mb-0 muted">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
