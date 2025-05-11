import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Vibration, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddBlockModal from './AddBlockModal';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';





// ตั้งค่าให้แจ้งเตือนตอนแอปเปิดอยู่
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DayTaskScreen({ route }) {
  const { dayName } = route.params;
  const navigation = useNavigation();

  const [myWork, setMyWork] = useState([]);
  const [addWork, setAddWork] = useState([
    { id: '1', name: 'START', type: 'text' },
    { id: '2', name: 'END', type: 'text' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  

  const [notificationSettings] = useState({
    advanceTime: 5, // คงไว้ตามโครงสร้างเดิม
    unit: 'minutes',
    mode: 'sound', // 'sound' หรือ 'shake'
  });

  // ขอสิทธิ์การแจ้งเตือน
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  // ลบเมื่อเขย่า
  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      const totalForce = Math.sqrt(
        Math.pow(accelerometerData.x, 2) +
        Math.pow(accelerometerData.y, 2) +
        Math.pow(accelerometerData.z, 2)
      );
      if (totalForce > 2.0) {
        setMyWork([]);
        Alert.alert('Deleted!', 'Puzzle ถูกลบหมดแล้ว!');
      }
    });
    return () => subscription.remove();
  }, []);

  const handleAddBlock = (newBlock) => {
    setAddWork(prev => [...prev, { ...newBlock, id: Date.now().toString() }]);
  };

  const mapDayToWeekTitle = (day) => {
    const map = {
      Monday: 'WEEK 1',
      Tuesday: 'WEEK 2',
      Wednesday: 'WEEK 3',
      Thursday: 'WEEK 4',
      Friday: 'WEEK 5',
      Saturday: 'WEEK 6',
      Sunday: 'WEEK 7',
    };
    return map[day] || day;
  };

  const handleDrop = (block) => {
    const newBlock = { ...block, id: Date.now().toString(), started: false };
    setMyWork(prev => [...prev, newBlock]);
  };

  // ฟังก์ชันการลบ Block จาก AddWork
  const handleDeleteFromAddWork = (id) => {
    setAddWork(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteFromMyWork = (id) => {
    setMyWork(prev => prev.filter(item => item.id !== id));
  };
  

  const handleDone = () => {
  const updated = myWork.map((task) => {
    if (task.started || !task.timer) return task;

    setTimeout(async () => {
      if (notificationSettings.mode === 'sound') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '✅ Task Complete',
            body: `Your task "${task.name}" is finished.`,
            sound: true,
          },
          trigger: null,
        });
      } else if (notificationSettings.mode === 'shake') {
        Vibration.vibrate();
        Alert.alert('⏰ DONE!', `Task "${task.name}" finished!`);
      }

      console.log('บันทึกข้อมูล:', {
        name: task.name,
        timer: task.timer,
        finishedAt: new Date(),
      });
    }, task.timer * 1000); // แปลงจากวินาทีเป็นมิลลิวินาที

    // ตั้งค่าเริ่มต้นให้สถานะ done เป็น false และเปลี่ยนเป็น true เมื่อกด DONE
    return { ...task, started: true, done: false }; // ใช้สถานะ `done: false`
  });

  setMyWork(updated);

  // ส่งข้อมูลกลับไป TaskListScreen
  const returnedTasks = updated
    .filter(task => task.name !== 'START' && task.name !== 'END')  // กรอง START, END ออก
    .map(task => ({
      name: task.name,
      done: task.done, // ส่งสถานะ done
      status: task.done ? 'done' : 'todo',
    }));

  navigation.navigate('TaskListScreen', {
    folderName: mapDayToWeekTitle(dayName),
    returnedTasks, // ส่งข้อมูล task ที่ถูกต้อง
  });
};



  return (
    <View style={styles.container}>
      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      

      <Text style={styles.title}>{dayName}</Text>

      <View style={styles.row}>
        {/* MY WORK */}
        <View style={styles.leftPanel}>
          <Text style={styles.panelTitle}>MY WORK</Text>
          <ScrollView>
            {myWork.map((item, index) => (
              <View key={index} style={styles.jigsawBlock}>
                <Image source={require('../assets/jigsaw.png')} style={styles.jigsawImage} />
                <Text style={styles.jigsawText}>{item.name}</Text>
                {item.timer && (
                  <Text style={styles.timerText}>Time: {formatTime(item.timer)}</Text>
                )}
                {item.started && (
                  <Text style={styles.timerText}>⏱ Running...</Text>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteFromMyWork(item.id)}
                >
                  <Ionicons name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ADD WORK */}
        <View style={styles.rightPanel}>
          <Text style={styles.panelTitle}>ADD WORK</Text>
          <ScrollView>
            {addWork.map((block, index) => (
              <TouchableOpacity
                key={index}
                style={styles.jigsawBlock}
                onPress={() => handleDrop(block)}
              >
                <Image source={require('../assets/jigsaw.png')} style={styles.jigsawImage} />
                <Text style={styles.jigsawText}>{block.name}</Text>
                
                {/* ปุ่มลบสำหรับ Block */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteFromAddWork(block.id)}
                >
                  <Ionicons name="trash" size={18} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={24} color="#4E342E" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* ปุ่มล่าง */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.shakeButton}>
          <Text style={styles.shakeButtonText}>SHAKE DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>DONE</Text>
        </TouchableOpacity>
      </View>

      {/* MODALS */}
      <AddBlockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddBlock}
      />

      
    </View>
  );
}

// ฟังก์ชันช่วยแปลงวินาทีเป็น H:M:S
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 16, padding: 8, borderRadius: 30, zIndex: 10 },
  notiButton: { position: 'absolute', top: 40, right: 16, padding: 8, borderRadius: 30, zIndex: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 60, marginBottom: 20, color: '#4E342E' },
  row: { flexDirection: 'row', flex: 1 },
  leftPanel: { flex: 1, padding: 10 },
  rightPanel: { flex: 1, padding: 10, backgroundColor: '#FFF9C4', borderRadius: 10 },
  panelTitle: { fontSize: 18, fontWeight: 'bold', color: '#4E342E', marginBottom: 10, textAlign: 'center' },
  jigsawBlock: {
    width: 100, height: 100, alignItems: 'center', justifyContent: 'center',
    marginBottom: -28, marginLeft: 10, position: 'relative',
  },
  jigsawImage: { width: 100, height: 100, position: 'absolute', resizeMode: 'contain' },
  jigsawText: { fontWeight: 'bold', color: '#4E342E', textAlign: 'center' },
  deleteButton: {
    position: 'absolute', top: 5, right: 5,
    backgroundColor: '#fff', borderRadius: 10, padding: 2,
  },
  addButton: {
    backgroundColor: '#fff', padding: 10, borderRadius: 20,
    alignSelf: 'center', marginTop: 40,
  },
  bottomRow: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 10,
  },
  shakeButton: { backgroundColor: '#ddd', padding: 10, borderRadius: 10 },
  shakeButtonText: { fontWeight: 'bold', color: '#4E342E' },
  doneButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 10 },
  doneButtonText: { fontWeight: 'bold', color: '#fff' },
  timerText: { fontSize: 14, color: '#4E342E', fontStyle: 'italic', marginTop: 5 },
});
