📁 todo-api/
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 database.js         # Database connection configuration
│   │   ├── 📄 redis.js            # Redis connection configuration
│   │   └── 📄 env.js              # Environment configuration
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js             # Bearer token authentication middleware
│   │   ├── 📄 error-handler.js    # Custom error handling middleware
│   │   └── 📄 logger.js           # Logging middleware
│   │
│   ├── 📁 models/
│   │   ├── 📄 user.js             # User database schema
│   │   └── 📄 todo.js             # Todo database schema
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.js             # Authentication routes
│   │   └── 📄 todos.js            # Todo CRUD routes
│   │
│   ├── 📁 services/
│   │   ├── 📄 auth-service.js     # Authentication logic
│   │   └── 📄 todo-service.js     # Todo business logic
│   │
│   ├── 📁 utils/
│   │   ├── 📄 validate.js         # Validation helpers
│   │   └── 📄 jwt.js              # JWT token utilities
│   │
│   └── 📄 app.js                  # Main application entry point
│
├── 📄 .env                        # Environment variables
├── 📄 .env.example                # Example environment variables
├── 📄 package.json                # Project dependencies
├── 📄 README.md                   # Project documentation
└── 📄 drizzle.config.js           # Drizzle ORM configuration