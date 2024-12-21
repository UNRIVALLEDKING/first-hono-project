import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getDatabase } from '../config/database';
import {
  TodoInsertSchema,
  todos,
  TodoSelectSchema,
} from '../models/todo.model';

const todoRoutes = new OpenAPIHono();

const db = getDatabase();

// get todo  route
const getTodoRoute = createRoute({
  summary: 'All Todos',
  tags: ['Todo'],
  description: 'Get all Todos from the database',
  method: 'get',
  path: '/all-todos',
  request: {},
  responses: {},
});

todoRoutes.openapi(getTodoRoute, async (c) => {
  try {
    const allTasks = await db.select().from(todos);
    return c.json({
      message: 'all tasks fetched successfully',
      data: allTasks,
    });
  } catch (err) {
    console.error('something went wrong', err);
    return c.json({ error: 'request failed' }, 500);
  }
});

const createTodoResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
  }),
});

// create todo route
const createTodoRoute = createRoute({
  description: 'Add Tasks',
  tags: ['Todo'],
  method: 'post',
  path: '/add',
  request: {
    body: {
      content: {
        'application/json': {
          schema: TodoInsertSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createTodoResponseSchema,
        },
      },
    },
  },
});

todoRoutes.openapi(createTodoRoute, async (context) => {
  const { title, description } = context.req.valid('json');
  try {
    const newTodo = await db
      .insert(todos)
      .values({
        title,
        description,
      })
      .returning();
    console.log('error');
    return context.json({
      message: 'task created successfully',
      data: newTodo,
    });
  } catch (err) {
    console.log(err);
    return context.json({ error: 'something went wrong' }, 500);
  }
});

export default todoRoutes;
