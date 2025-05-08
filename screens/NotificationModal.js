// NotificationModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function NotificationModal({ visible, onClose, onSave, initialSettings }) {
  const [advanceTime, setAdvanceTime] = useState(initialSettings.advanceTime || '5');
  const [unit, setUnit] = useState(initialSettings.unit || 'minutes'); // minutes or hours
  const [mode, setMode] = useState(initialSettings.mode || 'sound'); // sound or shake

  const handleSave = () => {
    onSave({
      advanceTime: parseInt(advanceTime),
      unit,
      mode,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Notification Settings</Text>

          <TextInput
            placeholder="Advance time"
            keyboardType="numeric"
            value={advanceTime.toString()}
            onChangeText={setAdvanceTime}
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity onPress={() => setUnit('minutes')} style={[styles.option, unit === 'minutes' && styles.selected]}>
              <Text>Minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUnit('hours')} style={[styles.option, unit === 'hours' && styles.selected]}>
              <Text>Hours</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity onPress={() => setMode('sound')} style={[styles.option, mode === 'sound' && styles.selected]}>
              <Text>Sound</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('shake')} style={[styles.option, mode === 'shake' && styles.selected]}>
              <Text>Shake</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: '#4E342E' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  option: { padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', width: '48%', alignItems: 'center' },
  selected: { backgroundColor: '#E58C39' },
  saveButton: { backgroundColor: '#4E342E', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
});
