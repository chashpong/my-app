import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [folders, setFolders] = useState([
    
    
  ]);
  const [folderName, setFolderName] = useState('');

  // ใช้ค่าคงที่ ไม่สลับคอลัมน์แบบ dynamic
  const numColumns = 2;

  const addFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'กรุณาใส่ชื่อโฟลเดอร์');
      return;
    }
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      selected: false,
    };
    setFolders([...folders, newFolder]);
    setFolderName('');
  };

  const toggleSelectFolder = (id) => {
    setFolders(
      folders.map(folder =>
        folder.id === id ? { ...folder, selected: !folder.selected } : folder
      )
    );
  };

  const deleteSelectedFolders = () => {
    const selectedCount = folders.filter(folder => folder.selected).length;
    if (selectedCount === 0) {
      Alert.alert('แจ้งเตือน', 'โปรดเลือกโฟลเดอร์ที่ต้องการลบ');
      return;
    }
    setFolders(folders.filter(folder => !folder.selected));
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
        onPress={() => navigation.navigate('TaskListScreen', { folderName: item.name })}
      >
        <Text style={styles.folderIcon}>📁</Text>
        <Text style={styles.folderText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>วางแผนเรียน/ทำงาน</Text>
      </View>

      <FlatList
        key={numColumns} // ✅ ป้องกัน render error เมื่อใช้ numColumns
        data={folders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E58C39',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  grid: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  // styles.folderWrapper:
folderWrapper: {
  width: '45%',
  margin: '2.5%',
  height: 140, // ✅ กำหนดความสูงตายตัว
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
  folderIcon: {
    fontSize: 36,
  },
  folderText: {
    fontSize: 14,
    marginTop: 8,
    color: '#5D4037',
    fontWeight: 'bold',
    textAlign: 'center',
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
