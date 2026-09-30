function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found', req.originalUrl);
  next(error);
}

function errorHandler(err, req, res) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}


 function timeSign(req, res, next) {
   const startedAt = new Date();
   res.set('Accepted---At', startedAt.toISOString());
   next();
 }

module.exports = {
  notFound,
  errorHandler,
  timeSign,
};
