export function errorHandler(err, req, res, next) {
  // Log minimal côté serveur
  console.error(err);

  //erreurs 'métier'  que nous créons dans les services
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  };

  //Mongoose duplicate key error (ex: email déjà utilisé)
  if (err.code === 11000) {
    return res.status(400).json({ error: { message: "Duplicate key error" } });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: { message: err.message } });
  }
 
   return res.status(500).json({ error: { message: "Internal Server Error" } });
}
