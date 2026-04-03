// Not Found Middleware
export const notFound = (req, res, next) => {
    // Set status to 404
    res.status(404);

    // Create error message
    const error = new Error(`Not Found - ${req.originalUrl}`);

    // Pass to error handler
    next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    // If statusCode is still 200, set default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set response status
    res.status(err.status || statusCode);

    // Send JSON response
    res.json({
        message: err.message || 'Server error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};