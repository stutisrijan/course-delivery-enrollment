import { useState } from "react";
import { emptyCourse, Icon } from "../utils/ui";

export default function Modal({ modal, close, save }) {
  const [form, setForm] = useState(modal.course ? { title: modal.course.title, description: modal.course.description, category: modal.course.category } : emptyCourse);
  const lesson = modal.type === "lesson";
  return <div className="modal-backdrop"><form className="modal" onSubmit={(event) => { event.preventDefault(); save(form); }}><button type="button" className="modal-close" onClick={close} aria-label="Close"><Icon name="close" size={18}/></button><p className="eyebrow">{lesson ? "CURRICULUM" : "COURSE DETAILS"}</p><h2>{lesson ? "Add a lesson" : modal.course ? "Edit course" : "Create a course"}</h2><label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })}/></label>{!lesson && <label>Category<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Development"/></label>}<label>{lesson ? "Lesson content" : "Description"}<textarea required value={lesson ? (form.content || "") : form.description} onChange={(event) => setForm({ ...form, [lesson ? "content" : "description"]: event.target.value })} rows="5"/></label><button className="primary" type="submit">{lesson ? "Add lesson" : "Save course"} <Icon name="arrow" size={14}/></button></form></div>;
}
