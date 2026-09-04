import { request } from "./api";

export const getCourseProgress = (courseId) => request("get", `/progress/courses/${courseId}`);
export const completeCourseLesson = (lessonId) => request("patch", `/progress/lessons/${lessonId}/complete`);
