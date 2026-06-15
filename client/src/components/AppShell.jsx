import Sidebar from "./Sidebar";
import FloatingQuote from "./FloatingQuote";

function AppShell({ title, user, children }) {
  return (
    <div className="shell">
      <Sidebar user={user} />
      <main className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <span className="muted">{user?.email}</span>
        </header>
        <section className="content">{children}</section>
        <FloatingQuote />
      </main>
    </div>
  );
}

export default AppShell;
