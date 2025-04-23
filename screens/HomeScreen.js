import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // สำหรับไอคอน checkbox
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [folders, setFolders] = useState([
    { id: '1', name: 'TERM 1', selected: false },
    { id: '2', name: 'TERM 2', selected: false },
    { id: '3', name: 'TERM 3', selected: false },
  ]);
  const [folderName, setFolderName] = useState('');

  const addFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
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
      Alert.alert('Notice', 'Please select folders to delete');
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
        onPress={() => navigation.navigate('TaskList', { folderName: item.name })}
      >
        <Text style={styles.folderIcon}>📁</Text>
        <Text style={styles.folderText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.title}>วางแผนเรียน/ทำงาน</Text>
  </View>

      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
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
          <Text style={styles.circleButtonText}>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={deleteSelectedFolders}>
          <Text style={styles.circleButtonText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
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
  folderWrapper: {
    width: 90,
    height: 90,
    margin: 10,
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  folderBox: {
    backgroundColor: '#FFF8E1',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  folderIcon: {
    fontSize: 32,
  },
  folderText: {
    fontSize: 12,
    marginTop: 5,
    color: '#5D4037',
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
  circleButtonText: {
    fontSize: 28,
    color: '#FF9800',
  },
});
