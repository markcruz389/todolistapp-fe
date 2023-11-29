export type TodoStatus = "pending" | "completed";

export interface ITodo {
    id: number;
    description: string;
    status: TodoStatus;
    isDeleted: boolean;
}

export type ErrorResponseData = {
    error: {
        message: string;
    };
};
