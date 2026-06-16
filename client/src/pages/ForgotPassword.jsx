import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Logo from "../components/Logo";

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/user/forgotpassword", {
        email: formData.email,
        phone: formData.phone,
        newPassword: formData.newPassword,
      });
      setMessage(res.data.message);
      setFormData({
        email: "",
        phone: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <Logo className="auth-logo" />
        <div className="auth-copy">
          <h1>Reset your password safely.</h1>
          <p>
            Confirm your registered email and phone number, then set a new
            password for your ArogyaMitra account.
          </p>
        </div>
        <p className="auth-foot">Use the same phone number you used during registration.</p>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={resetPassword}>
          <h2>Forgot password</h2>
          <p className="muted">Verify your account details to continue.</p>

          {error && <div className="alert-inline error">{error}</div>}
          {message && <div className="alert-inline success">{message}</div>}

          <div className="field">
            <label htmlFor="email">Registered email</label>
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
            <label htmlFor="phone">Registered phone</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button className="primary-btn w-100" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>

          <p className="mt-3 mb-0 muted">
            Remembered it? <Link to="/login">Back to login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default ForgotPassword;
