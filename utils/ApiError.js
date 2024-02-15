// @desc   Throw ApiError instances to signal predictable errors within API operations.


class ApiError extends Error {
  // Constructor for the ApiError class
  constructor(message, statusCode) {
    super(message); // Calling the constructor of the parent Error class with the error message
    this.statusCode = statusCode; // Storing the HTTP status code (e.g., 404, 500) with the error
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error"; // Determining the error type: 'fail' for client errors (4xx), 'error' for server errors (5xx)
    this.isOptional = true; // Custom property to indicate if the error is operational or critical (can be used for error handling logic)
  }
}

// Exporting the ApiError class to be used in other parts of the application
module.exports = ApiError;
