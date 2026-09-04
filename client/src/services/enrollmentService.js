import api, { request } from "./api";

export const selfEnroll = (courseId) => request("post", `/enrollments/courses/${courseId}/self-enroll`);
export const bulkEnroll = (courseId, emails) => request("post", `/enrollments/courses/${courseId}/enroll/bulk`, { emails });
export const getMyEnrollments = () => request("get", "/enrollments/my");
export const exportCourseProgress = (courseId) => api.get(`/enrollments/courses/${courseId}/progress/export`, { responseType: "blob" });
