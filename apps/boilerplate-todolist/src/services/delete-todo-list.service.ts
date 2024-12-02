import { IdsSchema } from 'src/validations/typia-validator';
import { deleteTodo } from '../models/delete-todo-list';
import { getTodos } from '../models/get-todo-list';
import typia from 'typia';
import { error } from 'console';



export const deleteTodolist = async (c: any) => {
    try {
        // Lấy danh sách ID từ URL param `:id` (phân tách bởi dấu phẩy)
        const idsParam = c.req.param('id');
        const ids = idsParam ? idsParam.split(',').map((id: string) => parseInt(id.trim(), 10)) : [];

        const validation = IdsSchema(ids);
        if (!validation.success) {
            return c.json({
                error: 'Invalid ID',
                details: validation.errors.map((err) => err.path),
            }, 400);
        }

        // Lấy danh sách todos hiện tại từ Redis
        const todos = await getTodos();

        // Kiểm tra ID nào vượt quá phạm vi danh sách
        const outOfRangeIds = ids.filter((id: number) => id >= todos.length);
        if (outOfRangeIds.length > 0) {
            return c.json({
                error: 'Some IDs do not exist in the database',
                invalidIds: outOfRangeIds,
            }, 404);
        }

        // Xóa các Todo theo ID
        for (const id of ids) {
            await deleteTodo(id);
        }

        // Tùy chỉnh phản hồi dựa trên số lượng ID được xóa
        if (ids.length === 1) {
            return c.json({ message: 'Task deleted successfully' }, 200);
        }

        return c.json({ message: 'Tasks deleted successfully', deletedIds: ids }, 200);
    } catch (error) {
        console.error('Error deleting task(s):', error);
        return c.json({ error: 'Failed to delete task(s)' }, 500);
    }
};
