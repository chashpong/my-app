import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Value" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Value" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EA874B', padding: 20, paddingTop: 60 },
  backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  backText: { color: '#000', fontSize: 16, textDecorationLine: 'underline' },
  title: { fontSize: 32, fontWeight: 'bold', alignSelf: 'center', marginBottom: 30, color: '#000' },
  label: { fontSize: 16, marginBottom: 5, color: '#000' },
  input: { backgroundColor: '#fff', borderRadius: 6, padding: 10, marginBottom: 20 },
  button: { backgroundColor: '#333', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgot: { color: '#000', textDecorationLine: 'underline', marginTop: 15, alignSelf: 'center' },
});
