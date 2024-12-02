import { Hono } from 'hono';
import todoRouter from './routes/todoRoutes'; // Import đúng router
import { serve } from '@hono/node-server'; // Dùng để chạy ứng dụng trên Node.js
import { logger, setupConfiguration } from '@packages/common';

import createRedisService from '@packages/redis-connector'; // Hàm khởi tạo Redis Cluster

// Thiết lập cấu hình ứng dụng
setupConfiguration();

const redis = createRedisService();

const app = new Hono();

// Gắn router TODO vào ứng dụng
app.route('/todos', todoRouter); // Đồng bộ với các route đã định nghĩa

// Trang chủ
app.get('/', (c) => c.text('TODO App with Hono & Redis'));

// Endpoint kiểm tra kết nối Redis
app.get('/check-redis', async (c) => {
  try {
    const response = await redis.ping(); // Kiểm tra Redis có hoạt động không
    return c.json({ status: 'success', redis: response });
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return c.json({ status: 'error', message: 'Failed to connect to Redis' }, 500);
  }
});

// Xuất ứng dụng để dùng trong testing hoặc chạy bên ngoài
export { app };

// Khởi chạy server
serve(app, (info) => {
  logger.info(`Server is running at http://localhost:${info.port}`);
});
