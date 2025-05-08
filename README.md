## ข้อกำหนด

ก่อนที่คุณจะเริ่มต้นใช้งาน โปรดติดตั้งสิ่งต่อไปนี้บนเครื่องของคุณ:

- **Node.js** และ **npm**: [ดาวน์โหลด Node.js](https://nodejs.org/)
- **Expo CLI**: ติดตั้งโดยใช้คำสั่ง npm
  ```bash
  npm install -g expo-cli
  ```
- **MySQL**: ติดตั้ง MySQL หากคุณยังไม่ได้ติดตั้ง สามารถดาวน์โหลด MySQL ได้จาก [ที่นี่](https://dev.mysql.com/downloads/installer/)

## การตั้งค่าโปรเจกต์


### ขั้นตอนที่ 1: ตั้งค่า Frontend (Expo React Native)

1. **เข้าไปยังโฟลเดอร์โปรเจกต์**:
  

2. **ติดตั้ง dependencies สำหรับ frontend**:
   ติดตั้ง npm packages ที่จำเป็นสำหรับโปรเจกต์:
   ```bash
   npm install
   ```

3. **รันแอป**:
   เริ่มต้น Expo server เพื่อรันแอปในอุปกรณ์หรืออีมูเลเตอร์:
   ```bash
   npx expo start
   ```

   Expo CLI จะเปิดแท็บเบราว์เซอร์ที่แสดง QR code ให้คุณสแกนโดยใช้ **Expo Go** บนอุปกรณ์มือถือของคุณหรือใช้อีมูเลเตอร์

### ขั้นตอนที่ 2: ตั้งค่า Backend (Node.js กับ MySQL)

1. **เข้าไปยังโฟลเดอร์ backend**:
   ```bash
   cd backend
   ```

2. **ติดตั้ง dependencies สำหรับ backend**:
   ติดตั้ง npm packages สำหรับ backend:
   ```bash
   npm install
   ```

3. **ตั้งค่าฐานข้อมูล**:
   - เริ่มต้น MySQL และเข้าสู่ MySQL 

   - สร้างฐานข้อมูลและตารางสำหรับผู้ใช้:
     ```sql
     CREATE DATABASE IF NOT EXISTS clear_planner;
     USE clear_planner;

     CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(100),
       email VARCHAR(100) UNIQUE,
       password VARCHAR(255)
     );
     ```

4. **รัน backend server**:
   รัน backend server โดยใช้ Node.js:
   ```bash
   node server.js
   ```

   backend server จะเริ่มต้นและสามารถเข้าถึงได้ที่ `http://localhost:3000/`

### ขั้นตอนที่ 3: API Endpoints

API ต่อไปนี้สามารถใช้ได้ในแอปพลิเคชัน:

- **GET /users/**: ดึงข้อมูลผู้ใช้ทั้งหมด
- **POST /users/**: สร้างผู้ใช้ใหม่โดยใส่ `username`, `email`, และ `password`
- **GET /users/:id**: ดึงข้อมูลผู้ใช้ตาม `id`
- **PUT /users/:id**: อัปเดตข้อมูลผู้ใช้ตาม `id`
- **DELETE /users/:id**: ลบผู้ใช้ตาม `id`

### ตัวอย่างคำขอใช้ Postman

1. **GET ผู้ใช้ทั้งหมด**:
   - Method: `GET`
   - URL: `http://localhost:3000/users/`

2. **POST สร้างผู้ใช้ใหม่**:
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

3. **GET ผู้ใช้ตาม ID**:
   - Method: `GET`
   - URL: `http://localhost:3000/users/1`

4. **PUT อัปเดตข้อมูลผู้ใช้**:
   - Method: `PUT`
   - URL: `http://localhost:3000/users/1`
   - Body (JSON):
     ```json
     {
       "username": "john_doe_updated",
       "email": "john_updated@example.com",
       "password": "newpassword123"
     }
     ```

5. **DELETE ลบผู้ใช้**:
   - Method: `DELETE`
   - URL: `http://localhost:3000/users/1`


---



expo install expo-notifications expo-permissions
