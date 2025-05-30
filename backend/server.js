const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อม MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ใส่รหัสผ่าน MySQL ของคุณ
  database: 'clear_planner',
});

db.connect(err => {
  if (err) {
    console.error('MySQL error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ฟังก์ชัน hash รหัสผ่าน
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}



// ฟังก์ชันตรวจสอบ admin username และ password (hash ด้วย SHA-256)
function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    const hashedPassword = hashPassword(password);
    const sql = 'SELECT * FROM admins WHERE username = ? AND password = ?';
    db.query(sql, [username, hashedPassword], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) resolve(results[0]);
      else resolve(null);
    });
  });
}

// Admin Login API
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  try {
    const user = await authenticateUser(username, password);
    if (user) {
      const token = crypto.randomBytes(16).toString('hex');
      return res.json({
        success: true,
        user: { id: user.id, username: user.username },
        token,
      });
    } else {
      return res.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
});

// สมมติคุณใช้ Express และเชื่อมต่อ MySQL ด้วย mysql2 แล้วเหมือนโค้ดที่ส่งมา

app.get('/admin/summary', (req, res) => {
  const summary = {};

  const totalFoldersQuery = `SELECT COUNT(*) AS totalFolders FROM folders`;
  const totalUsersQuery = `SELECT COUNT(*) AS totalUsers FROM users`;
  const totalTasksQuery = `SELECT COUNT(*) AS totalTasks FROM tasks`;
  const pendingTasksQuery = `SELECT COUNT(*) AS pendingTasks FROM tasks WHERE status != 'done'`;
  const completedTasksQuery = `SELECT COUNT(*) AS completedTasks FROM tasks WHERE status = 'done'`;

  db.query(totalFoldersQuery, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error counting folders', error: err });
    summary.totalFolders = result[0].totalFolders;

    db.query(totalUsersQuery, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error counting users', error: err });
      summary.totalUsers = result[0].totalUsers;

      db.query(totalTasksQuery, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error counting tasks', error: err });
        summary.totalTasks = result[0].totalTasks;

        db.query(pendingTasksQuery, (err, result) => {
          if (err) return res.status(500).json({ message: 'Error counting pending tasks', error: err });
          summary.pendingTasks = result[0].pendingTasks;

          db.query(completedTasksQuery, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error counting completed tasks', error: err });
            summary.completedTasks = result[0].completedTasks;

            res.status(200).json(summary);
          });
        });
      });
    });
  });
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



// ✅ เพิ่ม task ใหม่ (รองรับ week, day, user, folder)
app.post('/api/tasks', (req, res) => {
  const { name, status, weekName, dayName, folderId, userId, timerSeconds } = req.body;
  console.log('BODY:', req.body);

  const query = `
    INSERT INTO tasks (name, status, week_name, day_name, folder_id, user_id, timer_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, status, weekName, dayName, folderId, userId, timerSeconds],
    (err, result) => {
      if (err) {
        console.error('❌ SQL Error:', err);
        return res.status(500).send('Error adding task');
      }
      res.status(200).send('Task added successfully');
    }
  );
});

// ดึง tasks ตาม user, folder, week, day
app.get('/api/tasks', (req, res) => {
  const { userId, folderId, weekName, dayName } = req.query;

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  }
  if (folderId) {
    query += ' AND folder_id = ?';
    params.push(folderId);
  }
  if (weekName) {
    query += ' AND week_name = ?';
    params.push(weekName);
  }
  if (dayName) {
    query += ' AND day_name = ?';
    params.push(dayName);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Fetch Error:', err);
      return res.status(500).send('Error fetching tasks');
    }
    console.log('Tasks fetched:', results);
    res.json(results);
  });
});



app.put('/api/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating status', error: err });
      res.status(200).json({ message: 'Status updated successfully' });
    }
  );
});

// PUT /api/tasks/:id - แก้ไข task ทั้งหมด
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, status, weekName, dayName, folderId, userId, timerSeconds } = req.body;

  const sql = `
    UPDATE tasks SET
      name = ?,
      status = ?,
      week_name = ?,
      day_name = ?,
      folder_id = ?,
      user_id = ?,
      timer_seconds = ?
    WHERE id = ?
  `;

  db.query(sql, [name, status, weekName, dayName, folderId, userId, timerSeconds, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ message: 'Error updating task' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  });
});


// ✅ PUT /api/tasks/week-name - แก้ไขชื่อ week
app.put('/api/tasks/week-name', (req, res) => {
  const { oldWeekName, newWeekName, userId, folderId } = req.body;

  if (!oldWeekName || !newWeekName || !userId || !folderId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    UPDATE tasks
    SET week_name = ?
    WHERE week_name = ? AND user_id = ? AND folder_id = ?
  `;

  db.query(sql, [newWeekName, oldWeekName, userId, folderId], (err, result) => {
    if (err) {
      console.error('❌ SQL Error (update week name):', err);
      return res.status(500).json({ message: 'Failed to update week name' });
    }

    return res.status(200).json({ message: 'Week name updated successfully' });
  });
});

// ❌ DELETE /api/tasks/:id - ลบ task ตาม ID
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ message: 'Error deleting task' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

/// DELETE /api/tasks/week?weekName=...&userId=...&folderId=...
app.delete('/api/tasks/week', (req, res) => {
  const { weekName, userId, folderId } = req.query;

  if (!weekName || !userId || !folderId) {
    return res.status(400).json({ message: 'Missing weekName or userId or folderId' });
  }

  db.query(
    'DELETE FROM tasks WHERE week_name = ? AND user_id = ? AND folder_id = ?',
    [weekName, userId, folderId],
    (err, result) => {
      if (err) {
        console.error('Error deleting tasks by week:', err);
        return res.status(500).json({ message: 'Error deleting tasks by week' });
      }
      res.status(200).json({ message: 'Week tasks deleted successfully' });
    }
  );
});





// 📥 GET /api/folders?userId=...
app.get('/api/folders', (req, res) => {
  const { userId } = req.query;
  let query = 'SELECT * FROM folders';
  const params = [];
  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  }
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching folders:', err);
      return res.status(500).json({ message: 'Error fetching folders' });
    }
    res.status(200).json(results);
  });
});


// ➕ POST /api/folders
app.post('/api/folders', (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ message: 'Missing name or userId' });

  db.query('INSERT INTO folders (name, user_id) VALUES (?, ?)', [name, userId], (err, result) => {
    if (err) {
      console.error('Error adding folder:', err);
      return res.status(500).json({ message: 'Error adding folder' });
    }
    res.status(200).json({ message: 'Folder added successfully', folderId: result.insertId });
  });
});

// PUT /api/folders/:id - แก้ไขชื่อโฟลเดอร์
app.put('/api/folders/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  db.query(
    'UPDATE folders SET name = ? WHERE id = ?',
    [name, id],
    (err, result) => {
      if (err) {
        console.error('Error updating folder:', err);
        return res.status(500).json({ message: 'Update failed' });
      }
      res.status(200).json({ message: 'Folder updated successfully' });
    }
  );
});


// ❌ DELETE /api/folders/:id
app.delete('/api/folders/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM folders WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting folder:', err);
      return res.status(500).json({ message: 'Error deleting folder' });
    }
    res.status(200).json({ message: 'Folder deleted successfully' });
  });
});







app.listen(3000, () => {
  console.log('Server running on port 3000');
});
