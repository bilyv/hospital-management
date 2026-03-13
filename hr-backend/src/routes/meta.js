const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/departments', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DepId, DepName FROM department ORDER BY DepName');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/departments', requireAuth, async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Department name is required.' });

  try {
    const [result] = await pool.query('INSERT INTO department (DepName) VALUES (?)', [name]);
    return res.status(201).json({ DepId: result.insertId, DepName: name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/posts', requireAuth, async (req, res) => {
  const { departmentId } = req.query || {};
  const params = [];
  let sql = 'SELECT PostID, PostTitle, DepId FROM post';

  if (departmentId) {
    sql += ' WHERE DepId = ?';
    params.push(departmentId);
  }

  sql += ' ORDER BY PostTitle';

  try {
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/posts', requireAuth, async (req, res) => {
  const { title, departmentId } = req.body || {};
  if (!title || !departmentId) {
    return res.status(400).json({ message: 'Post title and department ID are required.' });
  }

  try {
    const [result] = await pool.query('INSERT INTO post (DepId, PostTitle) VALUES (?, ?)', [
      departmentId,
      title
    ]);
    return res.status(201).json({ PostID: result.insertId, PostTitle: title, DepId: departmentId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;