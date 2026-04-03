export const notFound = (req, res, next) => { res.status(404); const err = new Error(`Not Found - ${req.originalUrl}`); next(err); };

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(err.status || statusCode).json({ message: err.message || 'Server error', stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
};
