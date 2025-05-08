// StatusTaskScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatusTaskScreen({ route, navigation }) {
  const { status, tasks, weekTitle } = route.params;

  const filteredTasks = tasks.filter(task => task.status === status);

  const statusColors = {
    todo: '#FFF',
    inprogress: '#00BFFF',
    done: '#FF69B4',
  };

  const displayText = {
    todo: 'TO DO',
    inprogress: 'IN PROGRESS',
    done: 'DONE',
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{weekTitle} - {displayText[status]}</Text>

      {filteredTasks.length === 0 ? (
        <Text style={styles.emptyText}>No tasks found.</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, { backgroundColor: statusColors[status] }]}>
              <Text style={styles.taskText}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E58C39', padding: 16 },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 30,
    marginTop: 40,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4E342E',
    marginTop: 50,
    marginBottom: 20,
  },
  taskItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  },
});
