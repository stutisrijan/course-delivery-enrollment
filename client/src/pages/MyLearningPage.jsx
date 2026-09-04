import { useEffect, useState } from "react";
import LearnerProgress from "../components/LearnerProgress";
import { getMyEnrollments } from "../services/enrollmentService";
import { Icon } from "../utils/ui";

export default function MyLearningPage({ open }) {
  const [items, setItems] = useState([]);
  useEffect(() => { getMyEnrollments().then((data) => setItems(data.enrollments || [])).catch(() => setItems([])); }, []);
  return <section className="course-grid">{items.map((enrollment) => <article className="course-card" key={enrollment.id}><div className="course-visual"><span>{enrollment.course.category?.[0]}</span></div><div className="card-body"><p className="category">{enrollment.course.category}</p><h3>{enrollment.course.title}</h3><LearnerProgress courseId={enrollment.course.id} compact/><button className="text-btn" onClick={() => open(enrollment.course)}>Continue learning <Icon name="arrow" size={14}/></button></div></article>)}{!items.length && <div className="empty-state">You have not enrolled in a course yet.</div>}</section>;
}
