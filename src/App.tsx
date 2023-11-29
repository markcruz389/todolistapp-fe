import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import Todo from "./pages/Todo/Todo";
import NotFound from "./pages/NotFound/NotFound";
import { TodoProvider } from "./contexts/TodosContext";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TodoProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="todos" />} />
                        <Route path="/todos" element={<Todo />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </TodoProvider>

            <Toaster />
        </QueryClientProvider>
    );
}

export default App;
