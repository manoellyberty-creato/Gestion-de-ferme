import { verifyToken } from '../services/auth.service.js';

export default (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Non autorisé' });

<<<<<<< HEAD:backend/src/middleware/requireAuth.js
    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

=======
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res
      .status(401)
      .json({ error: { message: "Missing authorisation  header" } });
  }
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: { message: "Invalid authorization format" } });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("payload", payload);
    req.auth = {
      UserId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: { message: "Invalid or expired token" } });
  }
}
>>>>>>> 2180c838e4fbe113c4a9bd2dd5ce97ba11634589:backend/src/middlewares/requireAuth.js
