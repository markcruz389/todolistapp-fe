import { useContext, useEffect } from "react";
import { Check, Ban } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

import { ITodo, TodoStatus } from "@/common/types";
import { TODO_STATUS, API_BASE_URL } from "@/common/constants";
import { TodoContext, TodosContextType } from "@/contexts/TodosContext";
import { ErrorResponseData } from "@/common/types";

type Props = {
    todo: ITodo;
};

type UpdateTodoResponse = {
    todo: ITodo;
};

const TodoListItem = ({ todo }: Props) => {
    const { toast } = useToast();
    const { todos, setTodos } = useContext(TodoContext) as TodosContextType;
    const { mutate, isError, isSuccess, error, data } = useMutation({
        mutationFn: ({
            status,
            isDeleted,
        }: {
            status?: TodoStatus;
            isDeleted?: boolean;
        }) => {
            return axios.put<UpdateTodoResponse>(
                `${API_BASE_URL}/todos/${todo.id}`,
                {
                    status,
                    isDeleted,
                }
            );
        },
    });

    const handleUpdateStatus = (status: TodoStatus, isDeleted?: boolean) => {
        mutate({ status, isDeleted });
    };

    useEffect(() => {
        if (isSuccess) {
            const newTodos = todos.map((_todo) => {
                if (_todo.id === todo.id) {
                    return { ...data.data.todo };
                }

                return _todo;
            });
            setTodos(newTodos.filter((todo) => !todo.isDeleted));

            toast({
                duration: 3000,
                title: "Successfully added todo",
            });
        }

        if (isError && axios.isAxiosError(error)) {
            const axiosError: AxiosError<ErrorResponseData> = error;
            toast({
                duration: 3000,
                variant: "destructive",
                title: "Failed to update todo",
                ...(axiosError.response && {
                    description: `${axiosError.response.status}: ${axiosError.response.data.error.message}`,
                }),
            });
        }
    }, [toast, isSuccess, isError, error]);

    return (
        <Card>
            <CardContent className="p-4 flex justify-between items-center">
                <p className="text-md font-medium leading-none">
                    {todo.description}
                </p>
                <div className="flex gap-x-1">
                    <TooltipProvider>
                        {todo.status !== TODO_STATUS.COMPLETED &&
                            todo.isDeleted === false && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    TODO_STATUS.COMPLETED,
                                                    todo.isDeleted
                                                )
                                            }
                                        >
                                            <Check
                                                className="h-4 w-4"
                                                color="#10eb00"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Mark as done</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}

                        {todo.status !== TODO_STATUS.COMPLETED &&
                            todo.isDeleted === false && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    todo.status,
                                                    true
                                                )
                                            }
                                        >
                                            <Ban
                                                className="h-4 w-4"
                                                color="#eb0000"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Mark as cancelled</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
};

export default TodoListItem;
