// config.js
import Constants from 'expo-constants';

const getBaseUrl = () => {
  try {
    if (Constants.expoConfig?.hostUri) {
      const ip = Constants.expoConfig.hostUri.split(':')[0];
      return `http://${ip}:3000`;  // เซิร์ฟเวอร์ Dev
    } else if (Constants?.debuggerHost) {
      const ip = Constants.debuggerHost.split(':')[0];
      return `http://${ip}:3000`;  // อีกแบบนึง (เก่าสำหรับบางเวอร์ชัน)
    } else {
      return 'http://localhost:3000';  // โปรดักชัน URL จริง
    }
  } catch (error) {
    console.error('Error getting baseUrl', error);
    return 'http://localhost:3000';  // fallback เสมอ
  }
};


export const API_URL = getBaseUrl();
