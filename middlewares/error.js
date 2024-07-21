const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  return res.status(statusCode).json({ success: false, message });
}

export default errorHandler;