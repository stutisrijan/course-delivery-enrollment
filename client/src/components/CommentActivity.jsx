import { useEffect, useState } from "react";
import { addCourseComment, getCourseActivity } from "../services/courseService";
import { date, nice } from "../utils/ui";

export default function CommentActivity({ courseId, instructor }) {
  const [comment, setComment] = useState(""); const [activities, setActivities] = useState([]); const [message, setMessage] = useState("");
  const load = () => { if (instructor) getCourseActivity(courseId).then((data) => setActivities(data.activities || [])).catch(() => setActivities([])); };
  useEffect(load, [courseId, instructor]);
  const submit = async (event) => { event.preventDefault(); try { await addCourseComment(courseId, comment); setComment(""); setMessage("Comment added"); load(); } catch (err) { setMessage(err.response?.data?.message || "Could not add comment"); } };
  return <section className="activity-grid"><form className="panel comment-form" onSubmit={submit}><p className="eyebrow">COURSE COMMENTS</p><h3>Leave a comment</h3><textarea value={comment} required onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." rows="4"/><button className="primary">Add comment</button>{message && <small>{message}</small>}</form>{instructor && <article className="panel activity-log"><p className="eyebrow">IMMUTABLE HISTORY</p><h3>Activity log</h3>{activities.length ? activities.map((item) => <div key={item.id}><b>{item.action === "COMMENTED" ? "Comment" : nice(item.action)}</b><span>{item.actor?.name || "Unknown"} - {date(item.createdAt)}</span>{item.action === "COMMENTED" && <p className="comment-text">{item.comment?.trim() || "Comment text is unavailable for this older activity."}</p>}</div>) : <p>No activity yet.</p>}</article>}</section>;
}
