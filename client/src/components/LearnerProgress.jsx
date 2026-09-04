import { useEffect, useState } from "react";
import { getCourseProgress } from "../services/progressService";
import { nice } from "../utils/ui";

export default function LearnerProgress({ courseId, version = 0, compact = false }) {
  const [progress, setProgress] = useState(null);
  useEffect(() => { getCourseProgress(courseId).then((data) => setProgress(data.progress)).catch(() => setProgress(null)); }, [courseId, version]);
  if (!progress) return compact ? <span className="progress-label">Progress unavailable</span> : null;
  return <div className={compact ? "progress-compact" : "progress-card"}><div><p className="eyebrow">YOUR PROGRESS</p><strong>{nice(progress.state)}</strong>{" "}<span>{progress.completedLessons} of {progress.totalLessons} lessons complete</span></div><div className="progress-ring" style={{ "--progress": `${progress.percentage}%` }}><b>{progress.percentage}%</b></div></div>;
}
