import { Icon } from "../utils/ui";

export default function AppShell({ user, instructor, page, setPage, alerts, onLogout, darkTheme, onToggleTheme, onCreateCourse, children, title }) {
  const navigation = instructor
    ? [["dashboard", "Dashboard"], ["courses", "Course library"], ["alerts", "Inactivity alerts"]]
    : [["dashboard", "Explore courses"], ["learning", "My learning"]];

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span><Icon name="logo" size={24}/></span> courseflow</div><p className="role-label">{instructor ? "INSTRUCTOR SPACE" : "LEARNER SPACE"}</p>
      <nav>{navigation.map(([id, label]) => <button className={page === id ? "active" : ""} onClick={() => setPage(id)} key={id}><span><Icon name={id}/></span>{label}{id === "alerts" && alerts.length > 0 && <b>{alerts.length}</b>}</button>)}</nav>
      <div className="profile"><div className="avatar">{user.name?.[0] || "U"}</div><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
      <button className="logout logout-visible" onClick={onLogout}>Log out</button>
    </aside>
    <main><header><div><p className="eyebrow">{instructor ? "OVERVIEW" : "LEARNING PORTAL"}</p><h1>{title}</h1></div><div className="header-actions"><button className="theme-toggle" onClick={onToggleTheme} aria-label={darkTheme ? "Switch to light theme" : "Switch to dark theme"} title={darkTheme ? "Light theme" : "Dark theme"}>{darkTheme ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 15.7A8.5 8.5 0 0 1 8.3 3.4 8.5 8.5 0 1 0 20.6 15.7Z"/></svg>}</button>{instructor && page === "courses" && <button className="primary" onClick={onCreateCourse}>+ Create course</button>}</div></header>{children}</main>
  </div>;
}
