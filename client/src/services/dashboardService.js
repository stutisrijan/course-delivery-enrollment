import { request } from "./api";

export const getDashboard = () => request("get", "/dashboard");
export const getInactivityAlerts = () => request("get", "/inactivity-alerts");
export const dismissInactivityAlert = (learnerId, courseId) => request("patch", `/inactivity-alerts/${learnerId}/${courseId}/dismiss`);
