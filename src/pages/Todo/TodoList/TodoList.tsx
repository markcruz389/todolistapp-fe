import { ITodo } from "@/common/types";
import TodoListItem from "./TodoListItem/TodoListItem";

type Props = {
    todos: ITodo[];
};

const TodoList = ({ todos }: Props) => {
    return (
        <>
            {todos?.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} />
            ))}
        </>
    );
};

export default TodoList;
