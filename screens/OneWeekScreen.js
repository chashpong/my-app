import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OneWeekScreen({ route, navigation }) {
    const { weekTitle } = route.params;

  const colors = ['#FFFF00', '#FF69B4', '#32CD32', '#FFA500', '#00BFFF', '#800080', '#FF0000'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [tasksByDay] = useState({
    Monday: [{ name: 'Math Homework', status: '' }],
    Tuesday: [{ name: 'Science Project', status: '' }],
    Wednesday: [{ name: 'English Essay', status: '' }],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });


  const countStatus = (status) => {
    let count = 0;
    for (const day of days) {
      count += tasksByDay[day]?.filter(task => task.status === status).length || 0;
    }
    return count;
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  <Ionicons name="arrow-back" size={24} color="#fff" />
</TouchableOpacity>

      <Text style={styles.title}>{weekTitle}</Text>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <TouchableOpacity
          key={index}
          style={[styles.dayBox, { backgroundColor: colors[index] }]}
          onPress={() => navigation.navigate('DayTask', { dayName: day })}
        >
          <Text style={styles.dayText}>{day}</Text>
        </TouchableOpacity>        
        ))}
      </View>

      <View style={styles.statusSummary}>
        <View style={styles.statusRow}>
          <View style={[styles.statusColor, { backgroundColor: '#fff' }]} />
          <Text style={styles.statusText}>TO DO</Text>
          <Text style={styles.countText}>{countStatus('todo')}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusColor, { backgroundColor: '#00BFFF' }]} />
          <Text style={styles.statusText}>IN PROGRESS</Text>
          <Text style={styles.countText}>{countStatus('inprogress')}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusColor, { backgroundColor: '#FF69B4' }]} />
          <Text style={styles.statusText}>DONE</Text>
          <Text style={styles.countText}>{countStatus('done')}</Text>
        </View>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4E342E',
    marginTop: 50,  
    marginBottom: 20,
  },  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  dayBox: { width: 140, height: 100, borderRadius: 15, margin: 10, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 16, fontWeight: 'bold', color: '#4E342E' },
  statusSummary: { marginTop: 30 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusColor: { width: 30, height: 10, borderRadius: 5, marginRight: 10 },
  statusText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#4E342E' },
  countText: { fontSize: 16, fontWeight: 'bold', color: '#4E342E' },
});
