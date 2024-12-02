import typia from "typia";

// Tạo schema cho dữ liệu Todo
export const TodoSchema = typia.createValidate<{
    task: string;
}>();


export const IdsSchema = typia.createValidate<number[]>();
export const IdsSchemaNumber = typia.createValidate<number>();