import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Logo from "../components/Logo";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/user/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.type === "admin" ? "/adminhome" : "/userhome", {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <Logo className="auth-logo" />
        <div className="auth-copy">
          <h1>Healthcare appointments, managed in one calm place.</h1>
          <p>
            Sign in to book verified doctors, track appointment status, and keep
            notifications from your care team visible.
          </p>
        </div>
        <p className="auth-foot">Patient, doctor, and admin workflows share one secure login.</p>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Welcome back</h2>
          <p className="muted">Enter your credentials to continue.</p>

          {error && <div className="alert-inline error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <p className="auth-helper-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          <button className="primary-btn w-100" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="mt-3 mb-0 muted">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
