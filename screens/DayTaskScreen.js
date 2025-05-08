import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddBlockModal from './AddBlockModal';
import NotificationModal from './NotificationModal';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import { ScrollView } from 'react-native';

// ตั้งค่าการแจ้งเตือนให้แสดงเมื่อแอปเปิดอยู่
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

  const [notificationSettings, setNotificationSettings] = useState({
    advanceTime: 5,
    unit: 'minutes',
    mode: 'sound',
  });
  const [notiModalVisible, setNotiModalVisible] = useState(false);

  // ขอ permission การแจ้งเตือน
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  // ลบงานเมื่อเขย่า
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

  const handleDrop = async (block) => {
    const newBlock = { ...block, id: Date.now().toString() };

    if (block.timer) {
      const ms = notificationSettings.unit === 'minutes'
        ? notificationSettings.advanceTime * 60 * 1000
        : notificationSettings.advanceTime * 60 * 60 * 1000;

      const delay = Math.max(block.timer * 60 * 1000 - ms, 0);

      if (notificationSettings.mode === 'sound') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Reminder',
            body: `Your task "${block.name}" is starting soon.`,
            sound: true,
          },
          trigger: {
            seconds: delay / 1000,
          },
        });
      } else if (notificationSettings.mode === 'shake') {
        setTimeout(() => {
          Vibration.vibrate();
          Alert.alert('📳 Reminder', `Task "${block.name}" is coming up!`);
        }, delay);
      }
    }

    setMyWork(prev => [...prev, newBlock]);
  };

  const handleDeleteFromMyWork = (id) => {
    setMyWork(prev => prev.filter(item => item.id !== id));
  };

  const handleDone = () => {
    Alert.alert('เสร็จแล้ว', 'บันทึกว่าวันนี้เสร็จเรียบร้อย ✅');
    setMyWork([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setNotiModalVisible(true)} style={styles.notiButton}>
        <Ionicons name="notifications" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{dayName}</Text>

      <View style={styles.row}>
        <View style={styles.leftPanel}>
          <Text style={styles.panelTitle}>MY WORK</Text>
          <ScrollView>

          {myWork.map((item, index) => (
            <View key={index} style={styles.jigsawBlock}>
              <Image source={require('../assets/jigsaw.png')} style={styles.jigsawImage} />
              <Text style={styles.jigsawText}>{item.name}</Text>
              {item.timer && (
                <Text style={styles.timerText}>Time: {item.timer} mins</Text>
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
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="#4E342E" />
          </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.shakeButton}>
          <Text style={styles.shakeButtonText}>SHAKE DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>DONE</Text>
        </TouchableOpacity>
      </View>

      <AddBlockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddBlock}
      />

      <NotificationModal
        visible={notiModalVisible}
        onClose={() => setNotiModalVisible(false)}
        onSave={setNotificationSettings}
        initialSettings={notificationSettings}
      />
    </View>
  );
}

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
