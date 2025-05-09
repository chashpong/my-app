import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NotificationModal({ visible, onClose, onSave, initialSettings }) {
  const [mode, setMode] = useState(initialSettings.mode || 'sound'); // sound or shake

  const handleSave = () => {
    onSave({ mode });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Notification Settings</Text>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setMode('sound')}
              style={[styles.option, mode === 'sound' && styles.selected]}
            >
              <Text style={mode === 'sound' ? styles.selectedText : null}>Sound</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('shake')}
              style={[styles.option, mode === 'shake' && styles.selected]}
            >
              <Text style={mode === 'shake' ? styles.selectedText : null}>Shake</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  option: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '48%',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#E58C39',
    borderColor: '#E58C39',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4E342E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});
