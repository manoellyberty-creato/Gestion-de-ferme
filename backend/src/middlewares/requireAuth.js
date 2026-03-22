import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret_change_me";

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
