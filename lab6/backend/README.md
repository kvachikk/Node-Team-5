# Electronics E-commerce RESTful API

A Node.js Express RESTful API for an electronics e-commerce platform, following Clean Architecture principles.

## Project Structure

```
src/
├── config/         # DB connection, environment config
├── models/         # Sequelize models
├── migrations/     # Sequelize migrations
├── repositories/   # Data access logic (wraps Sequelize)
├── services/       # Business logic layer
├── controllers/    # Express route handlers
├── routes/         # Express route definitions
├── middlewares/    # Error handlers, validators, etc.
├── utils/          # Helper functions
└── app.js          # Express setup
index.js            # Main entrypoint
```

## Features

- RESTful API design
- Clean modular architecture
- PostgreSQL database with Sequelize ORM
- Request validation with express-validator
- Error handling middleware
- Security with CORS and Helmet
- Transaction support for data integrity

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example`:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=electronics_ecommerce
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products/category/:categoryId/bulk` - Bulk create products for a category (transaction demo)

## Transaction Support

All create, update, and delete operations are handled with database transactions to ensure data integrity. If any part of an operation fails, the entire transaction is rolled back.

### Transaction Demo

The bulk product creation endpoint (`POST /api/products/category/:categoryId/bulk`) demonstrates transaction handling:

1. It creates multiple products as part of a single transaction
2. If any product fails validation or creation, all changes are rolled back
3. You can simulate a transaction failure by including `"simulateError": true` for any product in the array

Example request:
```json
POST /api/products/category/1/bulk
{
  "products": [
    {
      "name": "Laptop Model X",
      "description": "High-performance laptop",
      "price": 1299.99,
      "stock": 10,
      "specifications": { "processor": "i7", "ram": "16GB" }
    },
    {
      "name": "Smartphone Y",
      "description": "Latest smartphone model",
      "price": 799.99,
      "stock": 20,
      "simulateError": false
    }
  ]
}
```

To test transaction rollback, set `simulateError: true` for any product.

## License

This project is licensed under the ISC License. 