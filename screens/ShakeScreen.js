import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors'; // ใช้สำหรับตรวจจับการเขย่า

export default function DayTaskScreen() {
  const [myWork, setMyWork] = useState([]);
  const [shakeDetected, setShakeDetected] = useState(false);  // เพื่อจำว่าเคยเขย่าแล้วหรือไม่

  // ตรวจจับการเขย่าจาก Accelerometer
  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      // คำนวณความแรงจากการเคลื่อนไหว
      const totalForce = Math.sqrt(
        Math.pow(accelerometerData.x, 2) +
        Math.pow(accelerometerData.y, 2) +
        Math.pow(accelerometerData.z, 2)
      );
      // ถ้ามีการเขย่ามากกว่าแรงที่กำหนด (ในที่นี้คือ 2.0)
      if (totalForce > 2.0 && !shakeDetected) {
        setShakeDetected(true);  // ตั้งสถานะว่าเคยเขย่าแล้ว
        Alert.alert('Deleted!', 'Puzzle ถูกลบหมดแล้ว!');

        // ทำการลบ Puzzle ใน myWork
        setMyWork([]);  // หรือฟังก์ชันลบข้อมูลตามที่คุณใช้ เช่น setMyWork([])
        
        // รีเซ็ตสถานะ shakeDetected หลังจากทำการลบเพื่อให้พร้อมรับการเขย่าใหม่
        setTimeout(() => {
          setShakeDetected(false);
        }, 1000);  // ให้เวลาก่อนที่จะสามารถตรวจจับการเขย่าใหม่ได้
      }
    });

    return () => subscription.remove();
  }, [shakeDetected]);  // ตรวจสอบการเปลี่ยนแปลงของ shakeDetected

  return (
    <View>
      <Text>ระบบ Shake Delete พร้อมใช้งาน</Text>
    </View>
  );
}
