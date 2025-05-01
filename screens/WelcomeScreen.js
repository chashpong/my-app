import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CLEAR{'\n'}PLAN{'\n'}NER</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      {/* ปุ่มไปหน้า Home */}
      <TouchableOpacity style={styles.buttonHome} onPress={() => navigation.navigate('TaskListScreen')}>
        <Text style={styles.buttonHomeText}>GO TO HOME</Text>
      </TouchableOpacity>
    

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E58C39',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 60,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#fff5ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonHome: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonHomeText: {
    color: '#E58C39',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
