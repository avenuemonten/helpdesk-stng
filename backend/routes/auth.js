// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../db.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  let conn;
  try {
    conn = await getConnection();

    // Берём пользователя по username
    const rows = await conn.query(
      `SELECT id, username, full_name, department, computer_name, role, password_hash
       FROM users
       WHERE username = ?
       LIMIT 1`,
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ВРЕМЕННО: сравнение в лоб, без bcrypt
    // (у тебя в БД лежит admin123 / support123 / user123 в password_hash)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Готовим payload для фронта
    const payload = {
      id: user.id,
      username: user.username,
      fullname: user.full_name,
      department: user.department,
      computerName: user.computer_name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
