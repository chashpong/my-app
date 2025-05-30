# 📘 Clear Planner - ระบบจัดการแผนการเรียนและงาน

แอปพลิเคชัน Clear Planner คือระบบวางแผนและติดตามงานสำหรับนักเรียน/นักศึกษา โดยมีระบบจัดการผู้ใช้ โฟลเดอร์ งานรายสัปดาห์ และการตั้งเวลา

---

## 📦 สิ่งที่ต้องติดตั้งก่อนใช้งาน

- **Node.js** และ **npm**: [ดาวน์โหลด Node.js](https://nodejs.org/)
- **Expo CLI**: ติดตั้งโดยใช้คำสั่ง:
  ```bash
  npm install -g expo-cli
  ```
- **MySQL**: [ดาวน์โหลด MySQL](https://dev.mysql.com/downloads/installer/)

---

## ⚙️ การตั้งค่าโปรเจกต์

### 🔹 ขั้นตอนที่ 1: ตั้งค่า Frontend (React Native + Expo)

1. เข้าโฟลเดอร์โปรเจกต์
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. เริ่มต้นแอป:
   ```bash
   npx expo start
   ```
   > Expo จะเปิดเบราว์เซอร์ขึ้นมาให้คุณสแกน QR code ด้วยแอป **Expo Go** หรือใช้อีมูเลเตอร์

---

### 🔸 ขั้นตอนที่ 2: ตั้งค่า Backend (Node.js + MySQL)

1. เข้าโฟลเดอร์ backend:
   ```bash
   cd backend
   ```
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. สร้างฐานข้อมูลและตารางใน MySQL:

#### 🛠️ โครงสร้างฐานข้อมูล:
```sql
CREATE DATABASE IF NOT EXISTS clear_planner;
USE clear_planner;

-- ตารางผู้ใช้
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

-- ตารางโฟลเดอร์ของผู้ใช้
CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ตารางงาน (เชื่อมโยงโฟลเดอร์และผู้ใช้)
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status ENUM('todo', 'done') DEFAULT 'todo',
  week_name VARCHAR(20),
  day_name ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  folder_id INT,
  user_id INT,
  timer_seconds INT DEFAULT NULL,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

4. ตาราง admin 
```
  CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
รหัสของ admin
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

```
5. รัน backend server:
```bash
node server.js
```
> backend จะเปิดใช้งานที่ `http://localhost:3000/`

---

## 📡 API ที่ใช้งานได้

| Method | Endpoint           | รายละเอียด                      |
|--------|--------------------|-------------------------------|
| GET    | `/users/`          | ดึงข้อมูลผู้ใช้ทั้งหมด         |
| POST   | `/users/`          | เพิ่มผู้ใช้ใหม่                 |
| GET    | `/users/:id`       | ดึงข้อมูลผู้ใช้ตาม `id`        |
| PUT    | `/users/:id`       | แก้ไขข้อมูลผู้ใช้ตาม `id`      |
| DELETE | `/users/:id`       | ลบผู้ใช้ตาม `id`               |

---

## 📮 ตัวอย่างการใช้งานด้วย Postman

### 🔹 GET ผู้ใช้ทั้งหมด
- Method: `GET`
- URL: `http://localhost:3000/users/`

### 🔹 POST เพิ่มผู้ใช้ใหม่
- Method: `POST`
- URL: `http://localhost:3000/users/`
- Body (JSON):
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 🔹 GET ผู้ใช้ตาม ID
- Method: `GET`
- URL: `http://localhost:3000/users/1`

### 🔹 PUT อัปเดตผู้ใช้
- Method: `PUT`
- URL: `http://localhost:3000/users/1`
- Body (JSON):
```json
{
  "username": "john_updated",
  "email": "john_updated@example.com",
  "password": "newpass123"
}
```

### 🔹 DELETE ผู้ใช้
- Method: `DELETE`
- URL: `http://localhost:3000/users/1`

---

## ✅ หมายเหตุ

- หากต้องการใช้ร่วมกับแอป React Native กรุณาเชื่อมต่อ backend และ frontend ให้ถูกต้องผ่าน IP หรือ Network ของเครื่อง
- โครงสร้างฐานข้อมูลสามารถขยายเพิ่มสำหรับงานรายวัน สถานะ และระบบเตือนเวลา

---
