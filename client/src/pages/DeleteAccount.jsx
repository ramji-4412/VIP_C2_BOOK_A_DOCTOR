import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import AppShell from "../components/AppShell";

const reasons = [
  "I found another service",
  "I do not need appointments right now",
  "The app was difficult to use",
  "I am concerned about privacy",
  "I had a problem with doctors or bookings",
  "Other",
];

function DeleteAccount() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const submitDelete = async (event) => {
    event.preventDefault();
    setError("");

    if (!reason) {
      setError("Please select a reason before deleting your account.");
      return;
    }

    if (confirmText !== "DELETE") {
      setError("Type DELETE to confirm account deletion.");
      return;
    }

    setLoading(true);

    try {
      await API.delete("/user/deleteaccount", {
        data: {
          password,
          reason,
          feedback,
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setDeleted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete account.");
    } finally {
      setLoading(false);
    }
  };

  if (deleted) {
    return (
      <div className="goodbye-page">
        <section className="goodbye-card">
          <span className="goodbye-mark">ArogyaMitra</span>
          <h1>Your account has been deleted.</h1>
          <p>
            Thank you for using ArogyaMitra. We hope your health journey stays
            steady, supported, and full of good care.
          </p>
          <p className="muted">
            Your feedback helps us improve the experience for future patients.
          </p>
          <Link className="primary-btn goodbye-link" to="/register">
            Return to ArogyaMitra
          </Link>
        </section>
      </div>
    );
  }

  return (
    <AppShell title="Delete Account" user={user}>
      <div className="page-head">
        <div>
          <h2>Before you go</h2>
          <p>
            Tell us what did not work for you. Then confirm deletion with your
            password.
          </p>
        </div>
      </div>

      <form className="panel delete-account-page" onSubmit={submitDelete}>
        {error && <div className="alert-inline error">{error}</div>}

        <section>
          <h3>Why are you quitting?</h3>
          <div className="reason-grid">
            {reasons.map((item) => (
              <label className={`reason-option ${reason === item ? "active" : ""}`} key={item}>
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={(event) => setReason(event.target.value)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="field">
          <label>What can we improve?</label>
          <textarea
            rows="5"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share anything that would have made ArogyaMitra more useful for you."
          />
        </section>

        <section className="delete-confirm-box">
          <h3>Confirm account deletion</h3>
          <p>
            This permanently removes your account, doctor profile if you have
            one, and related appointments.
          </p>

          <div className="grid cols-2">
            <div className="field">
              <label>Current password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Type DELETE</label>
              <input
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="actions">
            <button className="danger-btn" type="submit" disabled={loading}>
              {loading ? "Deleting account..." : "Delete my account"}
            </button>
            <button className="secondary-btn" type="button" onClick={() => navigate("/userhome")}>
              Keep my account
            </button>
          </div>
        </section>
      </form>
    </AppShell>
  );
}

export default DeleteAccount;
