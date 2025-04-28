import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors'; // ✅ สำคัญมาก!

export default function DayTaskScreen() {
  const [shakeDetected, setShakeDetected] = useState(false);

  useEffect(() => {
    const subscription = Accelerometer.addListener(data => {
      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) +
        Math.pow(data.y, 2) +
        Math.pow(data.z, 2)
      );
      if (totalForce > 2.0) {
        if (!shakeDetected) {
          setShakeDetected(true);
          Alert.alert('Shake detected!', 'Puzzle ถูกลบ!');
          // ทำลบ Puzzle ที่นี่ เช่น setMyWork([])
        }
      }
    });

    return () => subscription.remove();
  }, [shakeDetected]);

  return (
    <View>
      <Text>ระบบ Shake Delete พร้อมใช้งาน</Text>
    </View>
  );
}
