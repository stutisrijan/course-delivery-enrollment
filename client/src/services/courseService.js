import { request } from "./api";

export const listCourses = (params) => request("get", "/courses", null, { params });
export const getCourse = (courseId) => request("get", `/courses/${courseId}`);
export const createCourse = (form) => request("post", "/courses", form);
export const updateCourse = (courseId, form) => request("put", `/courses/${courseId}`, form);
export const changeCourseStatus = (courseId, action) => request("patch", `/courses/${courseId}/${action}`, {});
export const createLesson = (courseId, form) => request("post", `/courses/${courseId}/lessons`, form);
export const updateLesson = (lessonId, form) => request("put", `/lessons/${lessonId}`, form);
export const removeLesson = (lessonId) => request("delete", `/lessons/${lessonId}`);
export const reorderCourseLessons = (courseId, lessonIds) => request("patch", `/courses/${courseId}/lessons/reorder`, { lessonIds });
export const getCourseActivity = (courseId) => request("get", `/courses/${courseId}/activity`);
export const addCourseComment = (courseId, comment) => request("post", `/courses/${courseId}/comments`, { comment });
