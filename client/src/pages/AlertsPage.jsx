export default function AlertsPage({ alerts, dismiss }) {
  return <section className="panel alerts-panel">{alerts.length ? alerts.map((alert, index) => <div className="alert" key={index}><div className="alert-dot">!</div><div><h3>{alert.learnerName || "Learner"} needs a nudge</h3><p>Inactive in <strong>{alert.courseTitle || "this course"}</strong> for {alert.daysInactive || 14} days.</p></div><button className="secondary" onClick={() => dismiss(alert)}>Dismiss</button></div>) : <div className="empty-state">All clear - no inactive learners right now.</div>}</section>;
}
