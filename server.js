// Importing necessary modules
const express = require('express'); // Express framework for building web applications
const dotenv = require('dotenv'); // Dotenv for loading environment variables from a .env file
const morgan = require('morgan'); // Morgan for logging request details

// Configure dotenv to read environment variables from the .env file
dotenv.config({ path: '.env' });

// Importing custom modules
const ApiError = require('./utils/ApiError'); // Custom ApiError for handling API errors
const globalError = require('./middleware/errorMiddleware'); // Middleware for global error handling
const dbConnection = require('./config/database'); // Database connection configuration

// Importing routes
const categoryRoute = require('./routes/categoryRoute'); // Route for category-related operations
const subcategoryRoute = require('./routes/subcategoryRoute'); // Route for subcategory-related operations
const brandRoute = require('./routes/brandRoute'); // Route for brand-related operations
const productRoute = require('./routes/productRoute');

// Establish database connection
dbConnection();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Conditionally use morgan logging in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging format for development
  console.log(`mode: ${process.env.NODE_ENV}`); // Log the current mode (development)
}

// Route handlers for different paths
app.use('/api/v1/categories', categoryRoute); // Categories route
app.use('/api/v1/subcategories', subcategoryRoute); // Subcategories route
app.use('/api/v1/brands', brandRoute); // Brands route
app.use('/api/v1/products',productRoute)

// Handler for all other routes not defined (404 error)
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400)); // Trigger an ApiError if the route is not found
});

// Use the global error handling middleware
app.use(globalError);

// Define the port the application will listen on
const PORT = process.env.PORT || 8000;

// Start the server and listen on the defined port
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`); // Log the error details
  server.close(() => {
    console.error(`Shutting down....`); // Notify about the shutdown
    process.exit(1); // Exit the process with an error code
  });
});
