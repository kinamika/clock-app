import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    // Standard style backgroundColor 'blue' ensures you see something even if Tailwind fails
    <View 
      style={{ backgroundColor: 'blue', flex: 1, justifyContent: 'center', alignItems: 'center' }}
      className="bg-white-500" 
    >
      {/* 1. Standard React Native Text */}
      <Text style={{ color: 'red', fontSize: 40, fontWeight: 'bold' }}>
        HELLO ALLIAH!
      </Text>

      {/* 2. Tailwind Test Text (Should be white and bold if NativeWind is working) */}
      <Text className="text-white text-xl font-bold mt-4">
        Tailwind Test: Visible?
      </Text>
    </View>
  );
}