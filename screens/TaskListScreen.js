import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, Alert, ScrollView, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

export default function TaskListScreen({ route, navigation }) {
  const { folderName, userId, folderId } = route.params || {};
  const [weeks, setWeeks] = useState([]);
  const [newWeekName, setNewWeekName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editWeekIndex, setEditWeekIndex] = useState(null);
  const [editWeekNewName, setEditWeekNewName] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/tasks`, {
      params: { userId, folderId }
    })
      .then(response => {
        const groupedByWeek = {};
        response.data.forEach(task => {
          const title = task.week_name || 'WEEK ?';
          if (!groupedByWeek[title]) groupedByWeek[title] = [];
          groupedByWeek[title].push({
            id: task.id,
            name: task.name,
            status: task.status,
            done: task.status === 'done',
          });
        });
        const weeks = Object.keys(groupedByWeek).map((title, index) => ({
          id: `w${index + 1}`,
          title,
          tasks: groupedByWeek[title],
          selected: false,
        }));
        setWeeks(weeks);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        Alert.alert('โหลดงานล้มเหลว');
      });
  }, [userId, folderId]);

  const addWeek = () => {
    if (!newWeekName.trim()) return;
    const newId = Date.now().toString();
    setWeeks([...weeks, { id: newId, title: newWeekName, tasks: [], selected: false }]);
    setNewWeekName('');
    Keyboard.dismiss();
  };

  const toggleSelectWeek = (id) => {
    setWeeks(weeks.map(w => w.id === id ? { ...w, selected: !w.selected } : w));
  };

  const deleteSelectedWeeks = () => {
    const toDelete = weeks.filter(w => w.selected);
    if (!toDelete.length) return Alert.alert('แจ้งเตือน', 'โปรดเลือกสัปดาห์ที่ต้องการลบ');

    Promise.all(toDelete.map(w => axios.delete(`${API_URL}/api/tasks/week`, {
      params: { weekName: w.title, userId, folderId }
    })))
      .then(() => setWeeks(weeks.filter(w => !w.selected)))
      .catch(err => {
        console.error('❌ Error deleting weeks:', err);
        Alert.alert('Error', 'ไม่สามารถลบสัปดาห์ได้');
      });
  };

  const openAddTask = (id) => {
    setSelectedWeekId(id);
    setNewTask('');
    setShowModal(true);
  };

  const toggleTaskDone = (weekId, index) => {
    const updated = weeks.map(w => {
      if (w.id !== weekId) return w;
      const updatedTasks = w.tasks.map((t, i) => {
        if (i !== index) return t;
        const newStatus = t.done ? 'todo' : 'done';
        axios.put(`${API_URL}/api/tasks/${t.id}/status`, { status: newStatus })
          .catch(err => console.error('❌ Error updating status:', err));
        return { ...t, done: !t.done, status: newStatus };
      });
      return { ...w, tasks: updatedTasks };
    });
    setWeeks(updated);
    Alert.alert('อัปเดตสำเร็จ', 'เปลี่ยนสถานะงานแล้ว');
  };

  const addTaskToWeek = () => {
    if (!newTask.trim()) return;
    setWeeks(weeks.map(w =>
      w.id === selectedWeekId
        ? { ...w, tasks: [...w.tasks, { name: newTask, done: false, status: 'todo' }] }
        : w
    ));
    setShowModal(false);
  };

  const openEditWeekModal = (index) => {
    setEditWeekIndex(index);
    setEditWeekNewName(weeks[index].title);
    setEditModalVisible(true);
  };

  const updateWeekName = () => {
    const oldName = weeks[editWeekIndex].title;
    axios.put(`${API_URL}/api/tasks/week-name`, {
      oldWeekName: oldName,
      newWeekName: editWeekNewName,
      userId,
      folderId
    }).then(() => {
      const updated = [...weeks];
      updated[editWeekIndex].title = editWeekNewName;
      setWeeks(updated);
      setEditModalVisible(false);
    }).catch(err => {
      console.error('❌ Error updating name:', err);
      Alert.alert('Error', 'อัปเดตชื่อสัปดาห์ไม่สำเร็จ');
    });
  };

  const renderWeekBox = ({ item, index }) => (
    <TouchableOpacity style={styles.weekBox}>
      <View style={styles.weekHeaderRow}>
        <View style={styles.weekTitleRow}>
          <TouchableOpacity onPress={() => toggleSelectWeek(item.id)}>
            <Ionicons name={item.selected ? 'checkbox' : 'square-outline'} size={20} color={item.selected ? '#FF9800' : '#999'} />
          </TouchableOpacity>
          <Text style={styles.weekTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => openEditWeekModal(index)} style={styles.editIcon}>
            <Ionicons name="create-outline" size={18} color="#FF9800" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('OneWeek', {
            weekTitle: item.title,
            tasks: item.tasks,
            userId,
            folderId
          })}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList} nestedScrollEnabled>
        {item.tasks.map((task, i) => (
          <View key={i} style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskDone(item.id, i)}>
              <Ionicons name={task.done ? 'checkbox' : 'square-outline'} size={20} color={task.done ? '#4CAF50' : '#999'} />
            </TouchableOpacity>
            <Text style={[styles.taskText, task.done && { textDecorationLine: 'line-through', color: 'gray' }]}>{task.name}</Text>
          </View>
        ))}
      </ScrollView>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen', { userId })} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{folderName}</Text>

          <FlatList
            data={weeks}
            renderItem={renderWeekBox}
            keyExtractor={item => item.id}
            numColumns={1}
            contentContainerStyle={styles.grid}
          />

          <View style={styles.addWeekContainer}>
            <TextInput
              style={[styles.weekInput, { flex: 1 }]}
              placeholder="Enter Week Name"
              value={newWeekName}
              onChangeText={setNewWeekName}
            />
            <TouchableOpacity onPress={addWeek} style={styles.addWeekButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlButton} onPress={deleteSelectedWeeks}>
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Task</Text>
                <TextInput style={styles.modalInput} placeholder="Enter task" value={newTask} onChangeText={setNewTask} />
                <TouchableOpacity style={styles.modalButton} onPress={addTaskToWeek}>
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={editModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>แก้ไขชื่อ</Text>
                <TextInput style={styles.modalInput} value={editWeekNewName} onChangeText={setEditWeekNewName} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#E58C39', flex: 1, marginRight: 5 }]} onPress={updateWeekName}>
                    <Text style={styles.modalButtonText}>บันทึก</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc', flex: 1, marginLeft: 5 }]} onPress={() => setEditModalVisible(false)}>
                    <Text style={[styles.modalButtonText, { color: '#000' }]}>ยกเลิก</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 16 },
  backButton: { position: 'absolute', top: 50, left: 16, padding: 8, borderRadius: 30, zIndex: 10 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 10, color: '#4E342E' },
  grid: { justifyContent: 'center', paddingHorizontal: 10 },
  weekBox: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, margin: 10, width: '80%', height: 150, elevation: 2 },
  weekHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  weekTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editIcon: { marginLeft: 6, padding: 4 },
  weekTitle: { fontWeight: 'bold', color: '#5D4037' },
  addButtonText: { fontSize: 24, color: '#E58C39' },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  taskText: { fontSize: 14, color: '#000' },
  taskList: { maxHeight: 80, marginTop: 5 },
  addWeekContainer: { flexDirection: 'row', marginTop: 20 },
  weekInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 },
  addWeekButton: { backgroundColor: '#4E342E', borderRadius: 10, padding: 10, marginLeft: 10 },
  controlRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  controlButton: { backgroundColor: '#4E342E', borderRadius: 30, padding: 15, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', margin: 40, borderRadius: 10, padding: 10 },
  modalTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  modalButton: { padding: 10, borderRadius: 6, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
