import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { getDatabase } from '../config/database';
import { UserInsertSchema, UserLoginSchema, users } from '../models/user.model';

const authRoutes = new OpenAPIHono();

const db = getDatabase();

const methodNotAllowedHandler = (c, allowedMethods) => {
  c.res.headers.set('Allow', allowedMethods.join(', '));
  return c.json({ error: 'Method Not Allowed' }, 405);
};
// Login Route
const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              email: z.string().email(),
              name: z.string().nullable(),
            }),
          }),
        },
      },
      description: 'Successful login',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Unauthorized',
    },
  },
});

authRoutes.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid('json');
  console.log('yahallo');

  try {
    // Find user by email
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        storedPassword: users.password,
      })
      .from(users)
      .where(eq(users.email, email));

    // Simple password validation (not secure, just for testing)
    if (!user || user.storedPassword !== password) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Register Route
const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserInsertSchema.omit({
            id: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            message: z.string(),
          }),
        },
      },
      description: 'User successfully registered',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Registration failed',
    },
  },
});

authRoutes.openapi(registerRoute, async (c) => {
  const userData = await c.req.valid('json');

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email));

    if (existingUser.length > 0) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Insert new user
    const [insertedUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: userData.password,
        name: userData.name || null,
      })
      .returning({ id: users.id });

    return c.json(
      {
        id: insertedUser.id,
        message: 'User registered successfully',
      },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

authRoutes.on(['get', 'put', 'delete', 'patch'], '/login', (c) =>
  methodNotAllowedHandler(c, ['POST'])
);
authRoutes.on(['get', 'put', 'delete', 'patch'], '/register', (c) =>
  methodNotAllowedHandler(c, ['POST'])
);
export default authRoutes;
