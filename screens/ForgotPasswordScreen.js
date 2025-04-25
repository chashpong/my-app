import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleReset = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill in all fields');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    fetch('http:192.168.56.1:3000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Password reset successfully') {
          alert('Password reset success!');
          navigation.navigate('Login');
        } else {
          alert(data.message || 'Reset failed');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error connecting to server');
      });
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot password</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Value" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Value" secureTextEntry value={password} onChangeText={setPassword} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Value" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EA874B', padding: 20, paddingTop: 60 },
  backText: { color: '#000', fontSize: 16, textDecorationLine: 'underline', marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', alignSelf: 'center', marginBottom: 30, color: '#000' },
  label: { fontSize: 16, marginBottom: 5, color: '#000' },
  input: { backgroundColor: '#fff', borderRadius: 6, padding: 10, marginBottom: 20 },
  button: { backgroundColor: '#333', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
