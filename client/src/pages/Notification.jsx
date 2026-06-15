import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";

function Notification() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [notification, setNotification] = useState([]);
  const [seenNotification, setSeenNotification] = useState([]);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const [userRes, notificationRes] = await Promise.all([
        API.post("/user/getuserdata"),
        API.get("/user/getallnotification"),
      ]);
      setUser(userRes.data.data);
      setNotification(notificationRes.data.notification || []);
      setSeenNotification(notificationRes.data.seenNotification || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications.");
    }
  };

  const markAllSeen = async () => {
    await API.post("/user/markallnotificationseen");
    await loadNotifications();
  };

  const deleteAll = async () => {
    await API.delete("/user/deleteallnotification");
    await loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const formatType = (type = "notification") =>
    type
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const sortNewestFirst = (items) =>
    [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const renderItems = (items, emptyText) =>
    items.length ? (
      <div className="grid">
        {sortNewestFirst(items).map((item, index) => (
          <div className="panel" key={item._id || `${item.type}-${index}`}>
            <span className="badge-soft">{formatType(item.type)}</span>
            <p className="mb-0 mt-2">{item.message}</p>
            {item.createdAt && (
              <p className="muted mb-0 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="empty-state">{emptyText}</p>
    );

  return (
    <AppShell title="Notifications" user={user}>
      <div className="page-head">
        <div>
          <h2>Notifications</h2>
          <p>Review fresh and archived updates from the backend.</p>
        </div>
        <div className="actions">
          <button className="secondary-btn" onClick={markAllSeen} disabled={!notification.length}>
            Mark all seen
          </button>
          <button className="danger-btn" onClick={deleteAll} disabled={!notification.length && !seenNotification.length}>
            Delete all
          </button>
        </div>
      </div>

      {error && <div className="alert-inline error">{error}</div>}

      <section className="mb-4">
        <h3>Unread ({notification.length})</h3>
        {renderItems(notification, "No unread notifications.")}
      </section>

      <section>
        <h3>Seen ({seenNotification.length})</h3>
        {renderItems(seenNotification, "No seen notifications.")}
      </section>
    </AppShell>
  );
}

export default Notification;
