import express from "express";
import { authRequired } from "../middleware/auth.js";
import { getConnection } from "../db.js";

const router = express.Router();

router.get("/me", authRequired, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(
      "SELECT id, username, full_name, department, computer_name, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    const u = rows[0];
    res.json({
      id: u.id,
      username: u.username,
      fullName: u.full_name,
      department: u.department,
      computerName: u.computer_name,
      role: u.role,
      createdAt: u.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.patch("/me", authRequired, async (req, res) => {
  const { fullName, department, computerName } = req.body;

  let conn;
  try {
    conn = await getConnection();

    await conn.query(
      `UPDATE users SET
        full_name = COALESCE(?, full_name),
        department = COALESCE(?, department),
        computer_name = COALESCE(?, computer_name)
       WHERE id = ?`,
      [fullName, department, computerName, req.user.id]
    );

    const rows = await conn.query(
      "SELECT id, username, full_name, department, computer_name, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    const u = rows[0];

    res.json({
      id: u.id,
      username: u.username,
      fullName: u.full_name,
      department: u.department,
      computerName: u.computer_name,
      role: u.role,
      createdAt: u.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
