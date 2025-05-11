const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อม MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ใส่รหัสผ่าน MySQL
  database: 'clear_planner',
});

db.connect(err => {
  if (err) {
    console.error('MySQL error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ✔️ Register
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Email already exists or error', error: err });
      }
      res.status(200).json({ message: 'Registered successfully' });
    }
  );
});

// ✔️ Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.status(200).json({ message: 'Login successful', user: result[0] });
    }
  );
});

// ✔️ Forgot Password
app.post('/reset-password', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'UPDATE users SET password = ? WHERE email = ?',
    [password, email],
    (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(400).json({ message: 'User not found or error' });
      }
      res.status(200).json({ message: 'Password reset successfully' });
    }
  );
});

//GET /users – ดึงผู้ใช้ทั้งหมด
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
    res.status(200).json(results);
  });
});

//GET /users/:id – ดึงผู้ใช้ 1 คน
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  });
});
//PUT /users/:id – อัปเดตข้อมูลผู้ใช้
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  db.query(
    'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
    [username, email, password, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating user', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User updated successfully' });
    }
  );
});
//DELETE /users/:id – ลบผู้ใช้
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting user', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});



app.post('/api/tasks', (req, res) => {
  const { taskName, status, userId, weekId } = req.body;
  console.log('BODY:', req.body); // ✅ เพิ่มบรรทัดนี้

  const query = 'INSERT INTO tasks (task_name, status, user_id, week_id) VALUES (?, ?, ?, ?)';
  db.query(query, [taskName, status, userId, weekId], (err, result) => {
    if (err) {
      console.error('SQL Error:', err); // ✅ ดู error แบบละเอียด
      return res.status(500).send('Error adding task');
    }
    res.status(200).send('Task added successfully');
  });
});


// API สำหรับเพิ่ม week
app.post('/api/weeks', (req, res) => {
  const { userId, weekName } = req.body;
  const query = 'INSERT INTO weeks (user_id, week_name) VALUES (?, ?)';
  db.query(query, [userId, weekName], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding week');
    }
    res.status(200).send('Week added successfully');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
