export const emptyCourse = { title: "", description: "", category: "" };

export const date = (value) => value
  ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
  : "-";

export const nice = (value = "") => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());

export function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, style: { display: "inline-block", verticalAlign: "middle", flex: "none" } };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    courses: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 5.5v16"/></>,
    learning: <><path d="m5 3 14 9-14 9V3Z"/><path d="M5 3v18"/></>,
    alerts: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    logo: <><circle cx="12" cy="12" r="7"/><path d="m12 2 2 3-2 3-2-3 2-3ZM22 12l-3 2-3-2 3-2 3 2Z"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}
