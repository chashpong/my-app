import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function TaskListScreen({ route, navigation }) {
  const { folderName } = route.params || { folderName: 'TERM 1' };

  const [weeks, setWeeks] = useState([
    { id: 'w1', title: 'WEEK 1', tasks: [], selected: false },
    
  ]);

  

  useEffect(() => {
  if (route.params?.returnedTasks && route.params?.folderName) {
    const newTasks = route.params.returnedTasks;
    const targetFolder = route.params.folderName;

    const filteredTasks = newTasks.filter(task => task.name !== 'START' && task.name !== 'END'); // กรอง `START`, `END` ออก

    setWeeks(prevWeeks =>
      prevWeeks.map(week =>
        week.title === targetFolder
          ? { ...week, tasks: [...week.tasks, ...filteredTasks] }
          : week
      )
    );
  }
}, [route.params]);




  const [newWeekName, setNewWeekName] = useState('');

  // เพิ่ม week ใหม่
  const addWeek = () => {
    if (!newWeekName.trim()) {
      Alert.alert('Notice', 'Please enter a valid week name');
      return;
    }

    const newId = Date.now().toString();
    const newWeek = {
      id: newId,
      title: newWeekName,  // ชื่อที่ผู้ใช้กรอก
      tasks: [],
      selected: false,
    };

    setWeeks([...weeks, newWeek]);
    setNewWeekName('');  // รีเซ็ต input หลังจากเพิ่ม
  };

  // เลือก week
  const toggleSelectWeek = (weekId) => {
    setWeeks(weeks.map(week =>
      week.id === weekId ? { ...week, selected: !week.selected } : week
    ));
  };

  // ลบ week ที่เลือก
  const deleteSelectedWeeks = () => {
    const selectedCount = weeks.filter(week => week.selected).length;
    if (selectedCount === 0) {
      Alert.alert('Notice', 'Please select weeks to delete');
      return;
    }
    setWeeks(weeks.filter(week => !week.selected));
  };

  // เพิ่ม task ใน week
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const openAddTask = (weekId) => {
    setSelectedWeekId(weekId);
    setNewTask('');
    setShowModal(true);
  };

  const toggleTaskDone = (weekId, taskIndex) => {
  setWeeks(weeks.map(week =>
    week.id === weekId
      ? {
          ...week,
          tasks: week.tasks.map((task, index) =>
            index === taskIndex
              ? {
                  ...task,
                  done: !task.done,
                  status: task.done ? 'todo' : 'done',
                }
              : task
          ),
        }
      : week
  ));

  // เมื่อเปลี่ยนสถานะ task เสร็จแล้ว, แสดง alert
  Alert.alert(
    'SUCCESSFUL',
    'Task status updated successfully!',
    [{ text: 'OK', onPress: () => console.log('Task status confirmed!') }],
    { cancelable: false }
  );
};


  

  const addTaskToWeek = () => {
    if (!newTask.trim()) return;
    setWeeks(weeks.map(week =>
      week.id === selectedWeekId
        ? {
            ...week,
            tasks: [...week.tasks, { name: newTask, done: false, status: 'todo' }],
          }
        : week
    ));
    setShowModal(false);
  };

  // แสดงข้อมูล task ในแต่ละ week
  const renderWeekBox = ({ item }) => (
    <TouchableOpacity style={styles.weekBox}>
      <View style={styles.weekHeader}>
        <TouchableOpacity onPress={() => toggleSelectWeek(item.id)} style={styles.checkboxContainer}>
          <Ionicons
            name={item.selected ? 'checkbox' : 'square-outline'}
            size={20}
            color={item.selected ? '#FF9800' : '#999'}
          />
        </TouchableOpacity>

        <Text style={styles.weekTitle}>{item.title}</Text>

        <TouchableOpacity
  onPress={() =>
    navigation.navigate('OneWeek', {
      weekTitle: item.title,
      tasks: item.tasks,
    })
  }
  style={styles.addButton}
>
  <Text style={styles.addButtonText}>＋</Text>
</TouchableOpacity>

      </View>

      <ScrollView style={styles.taskList} nestedScrollEnabled>
        {item.tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskDone(item.id, index)}>
              <Ionicons
                name={task.done ? 'checkbox' : 'square-outline'}
                size={20}
                color={task.done ? '#4CAF50' : '#999'}
              />
            </TouchableOpacity>
            <Text style={[styles.taskText, task.done && { textDecorationLine: 'line-through', color: 'gray' }]}>
              {task.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{folderName}</Text>

      {/* แสดงรายการ week เป็นคอลัมน์เดียว */}
      <FlatList
        data={weeks}
        renderItem={renderWeekBox}
        keyExtractor={item => item.id}
        numColumns={1}  // แสดง 1 คอลัมน์
        contentContainerStyle={styles.grid}
      />

      {/* เพิ่ม Week ใหม่ */}
      <View style={styles.addWeekContainer}>
        <TextInput
          style={[styles.weekInput, { flex: 1 }]}  // ขยายให้เต็มความกว้าง
          placeholder="Enter Week Name"
          value={newWeekName}
          onChangeText={setNewWeekName}
        />
        <TouchableOpacity onPress={addWeek} style={styles.addWeekButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* การควบคุมการลบ */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.controlButton} onPress={deleteSelectedWeeks}>
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal สำหรับเพิ่ม task */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter task"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addTaskToWeek}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 16 },
  backButton: { position: 'absolute', top: 50, left: 16, padding: 8, borderRadius: 30, zIndex: 10 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 10, color: '#4E342E' },
  grid: { justifyContent: 'center', paddingHorizontal: 10 },
  weekBox: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, margin: 10,  width: '80%', height: 150, elevation: 2 },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, position: 'relative' },
  checkboxContainer: { position: 'absolute', top: -8, right: -5 },
  weekTitle: { fontWeight: 'bold', color: '#5D4037' },
  addButton: { fontSize: 18, color: '#E58C39', position: 'absolute', top: 100, right: -5 },
  addButtonText: { fontSize: 24, color: '#E58C39' },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  taskText: { fontSize: 14, color: '#000' },
  taskList: { maxHeight: 80, marginTop: 5 },
  addWeekContainer: { flexDirection: 'row', marginTop: 20 },
  weekInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, flex: 1 },
  addWeekButton: { backgroundColor: '#4E342E', borderRadius: 10, padding: 10, marginLeft: 10 },
  controlRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  controlButton: { backgroundColor: '#4E342E', borderRadius: 30, padding: 15, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', margin: 40, borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  modalButton: { backgroundColor: '#E58C39', padding: 10, borderRadius: 6, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
