# Cross-Platform
//โฟล์เดอร์ screens ไว้เก็บหน้า  screens ของหน้าจอต่างต่าง App.js ใช้โชว์หน้า screens ทั้งหมด
//โหลดแตกไฟล์ใช้ได้เลย
//ติดตั้งnpm 
 install -g expo
และ npm install
//การใช้งาน cd my-app และ  run
npx expo 
//run postman
cd backend และrun
node server.js
// เปิด command prompt 2 อัน


///////ฐานข้อมูลsql
//
CREATE DATABASE IF NOT EXISTS clear_planner;
USE clear_planner;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

//http://localhost:3000/users/
