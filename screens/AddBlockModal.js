import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';

export default function AddBlockModal({ visible, onClose, onAdd }) {
  const [blockType, setBlockType] = useState('text');
  const [blockName, setBlockName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleAdd = () => {
    if (!blockName.trim()) {
      alert('Please enter block name');
      return;
    }

    let totalSeconds = null;
    if (blockType === 'timer') {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;
      totalSeconds = h * 3600 + m * 60 + s;
    }

    const newBlock = {
      name: blockName,
      type: blockType,
      timer: blockType === 'timer' ? totalSeconds : null, // ใช้หน่วยเป็นวินาที
    };

    onAdd(newBlock);
    setBlockName('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setBlockType('text');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Block</Text>

          <TextInput
            placeholder="Block Name"
            value={blockName}
            onChangeText={setBlockName}
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text>Timer Block?</Text>
            <Switch
              value={blockType === 'timer'}
              onValueChange={(val) => setBlockType(val ? 'timer' : 'text')}
            />
          </View>

          {blockType === 'timer' && (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                placeholder="Hours"
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="Minutes"
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="Seconds"
                value={seconds}
                onChangeText={setSeconds}
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
          )}

          <TouchableOpacity onPress={handleAdd} style={styles.createButton}>
            <Text style={{ color: '#fff' }}>Create</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, padding: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  createButton: { backgroundColor: '#4E342E', padding: 10, borderRadius: 8, alignItems: 'center' },
});
