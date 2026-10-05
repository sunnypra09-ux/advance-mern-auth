const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong!!",
    errors: err.errors || [],
  });
};

export { errorMiddleware };
