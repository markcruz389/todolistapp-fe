import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { MoveRightIcon, MoveLeftIcon } from "lucide-react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import TodoForm from "./TodoForm/TodoForm";
import TodoList from "./TodoList/TodoList";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { TodoContext, TodosContextType } from "@/contexts/TodosContext";
import { ITodo, ErrorResponseData, TodoStatus } from "@/common/types";
import { TODO_STATUS, API_BASE_URL } from "@/common/constants";

type ResponseData = {
    data: {
        todos: ITodo[];
        pageData: {
            isLastPage: boolean;
        };
    };
};

const Todo = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const limit = searchParams.get("limit") || 5;
    const page = Number(searchParams.get("page")) || 1;
    const status = searchParams.get("status") || TODO_STATUS.PENDING;
    const isFirstPage = page === 1;
    const { toast } = useToast();
    const { todos, setTodos } = useContext(TodoContext) as TodosContextType;
    const { isSuccess, isError, data, error } = useQuery<ResponseData>({
        queryKey: ["todos", limit, page, status],
        queryFn: () => {
            return axios.get(
                `${API_BASE_URL}/todos/?limit=${limit}&page=${page}&status=${status}`
            );
        },
    });

    const handleClickNext = () => {
        setSearchParams({
            page: (page + 1).toString(),
            limit: limit.toString(),
            status,
        });
    };

    const handleClickBack = () => {
        setSearchParams({
            page: (page - 1).toString(),
            limit: limit.toString(),
            status,
        });
    };

    const handleFilter = (status: TodoStatus) => {
        setSearchParams({
            page: (page - 1).toString(),
            limit: limit.toString(),
            status,
        });
    };

    useEffect(() => {
        if (isSuccess && data) {
            console.log(data);
            setTodos(data.data.todos);
        }

        if (isError && axios.isAxiosError(error)) {
            const axiosError: AxiosError<ErrorResponseData> = error;
            toast({
                duration: 3000,
                variant: "destructive",
                title: "Failed to fetch todos",
                ...(axiosError.response && {
                    description: `${axiosError.response.status}: ${axiosError.response.data.error.message}`,
                }),
            });
        }
    }, [isSuccess, data, isError, error, setTodos, toast]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[420px]">
                <CardHeader className="text-center">
                    <CardTitle className="mb-2 lg:text-6xl text-4xl">
                        Todo List
                    </CardTitle>

                    <TodoForm />

                    {data?.data && <TodoList todos={todos} />}
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <RadioGroup
                        defaultValue={status}
                        className="flex"
                        onValueChange={(val) => handleFilter(val as TodoStatus)}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={TODO_STATUS.PENDING}
                                id="r1"
                            />
                            <Label htmlFor="r1">Pending</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={TODO_STATUS.COMPLETED}
                                id="r2"
                            />
                            <Label htmlFor="r2">Completed</Label>
                        </div>
                    </RadioGroup>
                    <div className="flex gap-x-2">
                        <TooltipProvider>
                            {!isFirstPage && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleClickBack}
                                        >
                                            <MoveLeftIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Previous</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}

                            {!data?.data.pageData.isLastPage && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleClickNext}
                                        >
                                            <MoveRightIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Next</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Todo;
