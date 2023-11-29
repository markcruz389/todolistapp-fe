import { TodoStatus } from "./types";

export const TODO_STATUS: Record<string, TodoStatus> = {
    PENDING: "pending",
    COMPLETED: "completed",
};

export const API_BASE_URL = "https://todolistapp-api.onrender.com/api/v1";
