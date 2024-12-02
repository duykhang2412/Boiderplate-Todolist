import { addTodo } from '../models/create-todo-list';
import { TodoSchema } from 'src/validations/typia-validator'; // Import schema từ bước 1
import { IValidation } from 'typia';

export const createTodolist = async (c: any) => {
    try {
        // Đọc body từ yêu cầu
        const body = await c.req.json();

        // Xác thực dữ liệu với Typia
        const validation: IValidation = TodoSchema(body);

        if (!validation.success) {
            // Nếu dữ liệu không hợp lệ, trả về lỗi chi tiết
            return c.json(
                {
                    error: 'Invalid task',
                    details: validation.errors.map((err) => err.path),
                },
                400
            );
        }

        // Dữ liệu hợp lệ, tiến hành thêm task
        await addTodo(body.task.trim());
        return c.json({ message: 'Task added successfully' }, 201);
    } catch (error) {
        console.error('Error adding task:', error);
        return c.json({ error: 'Failed to add task' }, 500);
    }
};
