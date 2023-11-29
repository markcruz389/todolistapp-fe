import {
    createContext,
    useState,
    PropsWithChildren,
    Dispatch,
    SetStateAction,
} from "react";
import { ITodo } from "@/common/types";

export type TodosContextType = {
    todos: ITodo[];
    setTodos: Dispatch<SetStateAction<ITodo[]>>;
};

const TodoContext = createContext<TodosContextType | null>(null);

const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<ITodo[]>([]);

    return (
        <TodoContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodoContext.Provider>
    );
};

export { TodoContext, TodoProvider };
