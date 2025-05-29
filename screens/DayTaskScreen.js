import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Image,
  Vibration, ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddBlockModal from './AddBlockModal';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { API_URL } from '../config';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function DayTaskScreen({ route }) {
  const { dayName, userId, folderId, weekName } = route.params;
  const navigation = useNavigation();

  const [myWork, setMyWork] = useState([]);
  const [addWork, setAddWork] = useState([
    { id: '1', name: 'START', type: 'text' },
    { id: '2', name: 'END', type: 'text' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const notificationSettings = { mode: 'sound' }; // หรือ 'shake'

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            Alert.alert('แจ้งเตือน', 'ไม่ได้รับสิทธิ์ให้ส่งการแจ้งเตือน');
          }
        }
      })();
    }
  }, []);

  const SHAKE_THRESHOLD = 2.0;
  const SHAKE_COOLDOWN_MS = 2000;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      let lastShakeTime = 0;

      const subscription = Accelerometer.addListener(({ x, y, z }) => {
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (totalForce > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN_MS) {
          lastShakeTime = now;
          setMyWork([]);
          Alert.alert('Deleted!', 'Puzzle ถูกลบหมดแล้ว!');
        }
      });

      Accelerometer.setUpdateInterval(300);
      return () => subscription.remove();
    }
  }, []);

  const handleAddBlock = (newBlock) => {
    setAddWork(prev => [...prev, { ...newBlock, id: Date.now().toString() }]);
  };

  const handleDrop = (block) => {
    const newBlock = { ...block, id: Date.now().toString(), started: false };
    setMyWork(prev => [...prev, newBlock]);
  };

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
          if (Platform.OS !== 'web') {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '✅ Task Complete',
                body: `Your task "${task.name}" is finished.`,
                sound: true,
              },
              trigger: null,
            });
          } else {
            console.log(`🔔 Task "${task.name}" finished.`);
          }
        } else if (notificationSettings.mode === 'shake') {
          if (Platform.OS !== 'web') {
            Vibration.vibrate();
          }
          Alert.alert('⏰ DONE!', `Task "${task.name}" finished!`);
        }
      }, task.timer * 1000);

      return { ...task, started: true, done: false };
    });

    setMyWork(updated);

    updated.forEach(task => {
      if (task.name !== 'START' && task.name !== 'END') {
        axios.post(`${API_URL}/api/tasks`, {
          name: task.name,
          status: task.done ? 'done' : 'todo',
          userId,
          folderId,
          weekName,
          dayName,
          timerSeconds: task.timer || 0,
        }).catch(err => {
          console.error('Error sending task to backend:', err);
        });
      }
    });

    const returnedTasks = updated
      .filter(task => task.name !== 'START' && task.name !== 'END')
      .map(task => ({
        name: task.name,
        done: task.done,
        status: task.done ? 'done' : 'todo',
      }));

    navigation.navigate('TaskListScreen', {
      folderName: weekName,
      returnedTasks,
      userId,
      folderId,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
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
                {item.timer && <Text style={styles.timerText}>Time: {formatTime(item.timer)}</Text>}
                {item.started && <Text style={styles.timerText}>⏱ Running...</Text>}
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
    </View>
  );
}

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 16, padding: 8, borderRadius: 30, zIndex: 10 },
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
