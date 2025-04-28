import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ import ตรงนี้

// Import หน้าต่างๆ ของคุณ
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import TaskListScreen from './screens/TaskListScreen';
import OneWeekScreen from './screens/OneWeekScreen';
import DayTaskScreen from './screens/DayTaskScreen';
import ShakeScreen from './screens/ShakeScreen'; // ต้อง import

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="TaskList" component={TaskListScreen} />
          <Stack.Screen name="OneWeek" component={OneWeekScreen} />
          <Stack.Screen name="DayTask" component={DayTaskScreen} />
          <Stack.Screen name="ShakeScreen" component={ShakeScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
