// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';
// import { loadEnv } from './env.js';

// // Import schemas
// import * as userSchema from '../models/user.model.js';
// import * as todoSchema from '../models/todo.model.js';

// let dbConnection = null;

// export function connectDatabase() {
//   const env = loadEnv();

//   const pool = new Pool({
//     connectionString: env.DATABASE_URL,
//     // Additional connection options
//     max: 10, // maximum number of clients in the pool
//     idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
//     connectionTimeoutMillis: 2000, // how long to wait when connecting to a client
//   });

//   dbConnection = drizzle({
//     client: pool,
//     schema: {
//       ...userSchema,
//       ...todoSchema,
//     },
//   });

//   return dbConnection;
// }

// export function getDatabase() {
//   if (!dbConnection) {
//     throw new Error('Database not initialized. Call connectDatabase first.');
//   }
//   return dbConnection;
// }

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { loadEnv } from './env.js';

// Import schemas
import * as userSchema from '../models/user.model.js';
import * as todoSchema from '../models/todo.model.js';

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    const env = loadEnv();

    this.pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10, // maximum number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
      connectionTimeoutMillis: 2000, // how long to wait when connecting to a client
    });

    this.db = drizzle(this.pool, {
      schema: {
        ...userSchema,
        ...todoSchema,
      },
    });

    DatabaseConnection.instance = this;
  }

  getConnection() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connectDatabase first.');
    }
    return this.db;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

// Singleton function to get database instance
export function connectDatabase() {
  return new DatabaseConnection().getConnection();
}

export function getDatabase() {
  return new DatabaseConnection().getConnection();
}
