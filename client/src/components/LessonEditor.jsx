import { useState } from "react";

export default function LessonEditor({ lesson, save, close }) {
  const [form, setForm] = useState({ title: lesson.title, content: lesson.content });
  return <div className="modal-backdrop"><form className="modal" onSubmit={(event) => { event.preventDefault(); save(form); }}><button type="button" className="modal-close" onClick={close}>x</button><p className="eyebrow">CURRICULUM</p><h2>Edit lesson</h2><label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required/></label><label>Lesson content<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows="5" required/></label><button className="primary">Save lesson</button></form></div>;
}
