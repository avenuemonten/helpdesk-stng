import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password, subdivision } = req.body || {};

  if (!username || !password || !subdivision) {
    return res.status(400).json({ error: "Укажи логин, пароль и подразделение" });
  }

  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    let user = rows[0];

    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);

      const count = await conn.query("SELECT COUNT(*) AS c FROM users");
      const role = count[0].c === 0 ? "admin" : "user";

      const insertRes = await conn.query(
        `INSERT INTO users (username, full_name, department, computer_name, role, password_hash)
         VALUES (?, '', ?, '', ?, ?)`,
        [username, subdivision, role, passwordHash]
      );

      const newRows = await conn.query("SELECT * FROM users WHERE id = ?", [insertRes.insertId]);
      user = newRows[0];
    } else {
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        computerName: user.computer_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        department: user.department,
        computerName: user.computer_name,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
