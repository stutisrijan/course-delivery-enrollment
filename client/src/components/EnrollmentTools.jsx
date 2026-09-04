import { useState } from "react";
import { nice } from "../utils/ui";

export default function EnrollmentTools({ bulkEnroll, exportProgress }) {
  const [emails, setEmails] = useState(""); const [results, setResults] = useState([]); const [error, setError] = useState("");
  const submit = async (event) => { event.preventDefault(); try { setError(""); const data = await bulkEnroll(emails.split(/[\s,;]+/).filter(Boolean)); setResults(data.results || []); } catch (err) { setError(err.message); } };
  const upload = async (event) => { const file = event.target.files?.[0]; if (file) setEmails(await file.text()); };
  return <section className="enrollment-tools panel"><div><p className="eyebrow">ENROLLMENT</p><h3>Enroll learners</h3><p>Paste email addresses or upload a text/CSV file.</p></div><form onSubmit={submit}><textarea value={emails} onChange={(event) => setEmails(event.target.value)} placeholder="learner@example.com, another@example.com" rows="3"/><div><label className="file-button">Upload list<input type="file" accept=".txt,.csv" onChange={upload}/></label><button className="primary">Enroll learners</button><button type="button" className="secondary" onClick={exportProgress}>Export CSV</button></div></form>{error && <p className="form-error">{error}</p>}{results.length > 0 && <div className="enrollment-results">{results.map((result) => <span key={result.email} className={result.status.toLowerCase()}>{result.email}: {nice(result.status)}</span>)}</div>}</section>;
}
