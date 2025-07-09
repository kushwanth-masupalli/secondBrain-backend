const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // <-- Print stack trace on every error

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  switch (statusCode) {
    case 500:
      res.json({
        message: "Internal Server Error by middleware",
        stack: err.stack,
      });
      break;
    case 404:
      res.json({ message: "URL Not Found" ,stack: err.stack,});
      break;
    case 401:
      res.json({ message: "Database not connected",stack: err.stack, });
      break;
    default:
      res.json({ message: err.message || "Unknown Error" ,stack: err.stack,});
  }
};

module.exports = errorHandler;
