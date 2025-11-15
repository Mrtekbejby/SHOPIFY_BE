import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      profile: user.profile
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export function requireProfile(allowedProfiles = []) {
  return function (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header." });
    }

    const token = authHeader.slice(7); 

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload; 

      if (allowedProfiles.length > 0) {
        if (!payload.profile || !allowedProfiles.includes(payload.profile)) {
          return res
            .status(403)
            .json({ error: "Forbidden. Insufficient profile." });
        }
      }

      next();
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
  };
}