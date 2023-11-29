import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { ErrorResponseData, ITodo } from "@/common/types";
import { TodoContext, TodosContextType } from "@/contexts/TodosContext";

const formSchema = z.object({ description: z.string().min(1) });
type Schema = z.infer<typeof formSchema>;
type CreateTodoResponse = {
    todo: ITodo;
};

const TodoForm = () => {
    const { todos, setTodos } = useContext(TodoContext) as TodosContextType;
    const { toast } = useToast();
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: "" },
    });
    const { mutate, isError, isSuccess, isPending, error, data } = useMutation({
        mutationFn: (newTodo: Schema) => {
            return axios.post<CreateTodoResponse>("api/todos", newTodo);
        },
    });

    const onSubmit = (values: Schema) => {
        mutate(values);
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();

            const newTodos = [data.data.todo, ...todos];
            setTodos(newTodos.slice(0, 5));

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
                title: "Failed to add todo",
                ...(axiosError.response && {
                    description: `${axiosError.response.status}: ${axiosError.response.data.error.message}`,
                }),
            });
        }
    }, [toast, form, isSuccess, isError, error]);

    return (
        <Form {...form}>
            <fieldset disabled={isPending}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter todo...."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button className="w-full" type="submit">
                            <PlusSquare className="mr-2" />
                            ADD
                        </Button>
                    </div>
                </form>
            </fieldset>
        </Form>
    );
};

export default TodoForm;
