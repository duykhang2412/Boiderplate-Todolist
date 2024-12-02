import { Hono } from 'hono';
import { createTodolist } from '../controllers/create-todo-list-controller';
import { updateTodolist } from '../controllers/update-todo-list-controller';
import { deleteTodolist } from '../controllers/delete-todo-list-controller';
import { getTodolist, getAllTodolist } from '../controllers/get-todo-list-controller';
const todoRouter = new Hono();

todoRouter.post('/create', createTodolist);
todoRouter.get('/get/:id?', getTodolist);
todoRouter.get('/get-all', getAllTodolist);
todoRouter.put('/update/:id', updateTodolist);
todoRouter.delete('/delete/:id', deleteTodolist);

export default todoRouter;
