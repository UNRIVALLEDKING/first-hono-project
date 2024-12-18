import { pinoLogger } from 'hono-pino';
import { loadEnv } from './config/env';
import { OpenAPIHono } from '@hono/zod-openapi';
import pretty from 'pino-pretty';
import pino from 'pino';
import { requestId } from 'hono/request-id';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import { logger } from 'hono/logger';
import { apiReference } from '@scalar/hono-api-reference';
import todoRoutes from './routes/todo.routes';
const env = loadEnv();
console.log(env);

const app = new OpenAPIHono();

// app
//   .use(
//     requestId({
//       options: {
//         requestId: () => crypto.randomUUID(),
//       },
//     })
//   )
//   .use(
//     pinoLogger({
//       pino: pino(pretty()),
//     })
//   );

app.use(logger());
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: 'Something went wrong' }, 500);
});

connectDatabase();

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' }, 200);
});

app.route('/auth', authRoutes);
app.route('/todo', todoRoutes);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/doc' },
  })
);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
