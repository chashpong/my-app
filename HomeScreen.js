
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

export default function HomeScreen({ route, navigation }) {
  const { userId } = route.params;
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  useEffect(() => {
    loadFolders();
  }, [userId]);

  const loadFolders = () => {
    axios.get(`${API_URL}/api/folders?userId=${userId}`)
      .then(res => {
        const folderList = res.data.map(folder => ({
          id: folder.id.toString(),
          name: folder.name,
          selected: false,
        }));
        setFolders(folderList);
      })
      .catch(err => {
        console.error('Error loading folders:', err);
        Alert.alert('Error', 'โหลดโฟลเดอร์ไม่สำเร็จ');
      });
  };

  const addFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'กรุณาใส่ชื่อโฟลเดอร์');
      return;
    }

    axios.post(`${API_URL}/api/folders`, {
      name: folderName,
      userId: userId,
    })
    .then(() => {
      setFolderName('');
      Keyboard.dismiss();
      loadFolders();
    })
    .catch(err => {
      console.error('Error adding folder:', err);
      Alert.alert('Error', 'ไม่สามารถเพิ่มโฟลเดอร์ได้');
    });
  };

  const deleteSelectedFolders = () => {
    const selected = folders.filter(folder => folder.selected);
    if (selected.length === 0) {
      Alert.alert('แจ้งเตือน', 'โปรดเลือกโฟลเดอร์ที่ต้องการลบ');
      return;
    }

    Promise.all(selected.map(folder =>
      axios.delete(`${API_URL}/api/folders/${folder.id}`)
    ))
    .then(() => loadFolders())
    .catch(err => {
      console.error('Error deleting folders:', err);
      Alert.alert('Error', 'ไม่สามารถลบโฟลเดอร์ได้');
    });
  };

  const startEditingFolder = (id, name) => {
    setEditingFolderId(id);
    setEditingFolderName(name);
  };

  const updateFolderName = (id) => {
    if (!editingFolderName.trim()) {
      Alert.alert('กรุณาใส่ชื่อใหม่');
      return;
    }

    axios.put(`${API_URL}/api/folders/${id}`, { name: editingFolderName })
      .then(() => {
        setEditingFolderId(null);
        setEditingFolderName('');
        loadFolders();
      })
      .catch(err => {
        console.error('Error updating folder:', err);
        Alert.alert('Error', 'ไม่สามารถอัปเดตชื่อโฟลเดอร์ได้');
      });
  };

  const toggleSelectFolder = (id) => {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, selected: !folder.selected } : folder
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.folderWrapper}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSelectFolder(item.id)}
      >
        <Ionicons
          name={item.selected ? 'checkbox' : 'square-outline'}
          size={20}
          color="#FF9800"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.folderBox}
        onPress={() => navigation.navigate('TaskListScreen', {
          folderName: item.name,
          folderId: item.id,
          userId: userId,
        })}
      >
        <Text style={styles.folderIcon}>📁</Text>
        {editingFolderId === item.id ? (
          <TextInput
            style={styles.folderTextInput}
            value={editingFolderName}
            onChangeText={setEditingFolderName}
            autoFocus
            onSubmitEditing={() => updateFolderName(item.id)}
            onBlur={() => setEditingFolderId(null)}
          />
        ) : (
          <TouchableOpacity onPress={() => startEditingFolder(item.id, item.name)}>
            <Text style={styles.folderText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>วางแผนเรียน/ทำงาน</Text>
          </View>

          {folders.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#fff', marginTop: 20 }}>
              ยังไม่มีโฟลเดอร์
            </Text>
          )}

          <FlatList
            data={folders}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />

          <TextInput
            style={styles.input}
            placeholder="ชื่อโฟลเดอร์ใหม่"
            value={folderName}
            onChangeText={setFolderName}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.circleButton} onPress={addFolder}>
              <Ionicons name="add" size={28} color="#FF9800" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={deleteSelectedFolders}>
              <Ionicons name="trash" size={28} color="#FF9800" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8, marginRight: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4E342E' },
  grid: { alignItems: 'center', paddingBottom: 20 },
  folderWrapper: {
    width: '45%',
    margin: '2.5%',
    height: 140,
    borderRadius: 15,
    backgroundColor: '#FFF8E1',
    elevation: 3,
    position: 'relative',
  },
  folderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  folderIcon: { fontSize: 36 },
  folderText: {
    fontSize: 14,
    marginTop: 8,
    color: '#5D4037',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  folderTextInput: {
    fontSize: 14,
    marginTop: 8,
    color: '#5D4037',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 5,
  },
  input: {
    height: 45,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  circleButton: {
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderColor: '#FF9800',
    borderWidth: 1,
  },
});
