export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
    path: req.originalUrl,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Unauthorized access.' });
  }

  console.error('Unhandled API error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred.';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
