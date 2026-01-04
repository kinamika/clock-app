import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../../assets/images/whale-background.jpg');

interface TimerPreset {
  id: string;
  name: string;
  duration: number; // in seconds
}

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(0); // This is the main timer state
  const [isRunning, setIsRunning] = useState(false);
  const [presets, setPresets] = useState<TimerPreset[]>([
    { id: '1', name: 'Cooking Shrimp', duration: 180 },
    { id: '2', name: 'Cooking Rice', duration: 1200 },
  ]);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState('');
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      Alert.alert("Time's Up!", "Your timer has finished."); // Notification when done
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // MANUAL ADJUSTMENT LOGIC
  const adjustTime = (seconds: number) => {
    if (isRunning) setIsRunning(false); // Pause if running to adjust
    setTimeLeft((prev) => Math.max(0, prev + seconds));
  };

  const startPreset = (duration: number) => {
    setTimeLeft(duration);
    setIsRunning(true);
  };

  return (
    <ImageBackground source={backgroundImage} className="flex-1" resizeMode="cover">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 150 }}>
        
        {/* MAIN TIMER DISPLAY */}
        <View className="items-center mb-12">
          <Text className="text-white text-8xl font-light font-mono shadow-2xl shadow-black">
            {formatTime(timeLeft)}
          </Text>

          {/* MANUAL ADJUSTMENT BUTTONS */}
          <View className="flex-row space-x-4 mt-6">
            <TouchableOpacity onPress={() => adjustTime(-60)} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <Text className="text-white">-1m</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustTime(60)} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <Text className="text-white">+1m</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustTime(300)} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <Text className="text-white">+5m</Text>
            </TouchableOpacity>
          </View>
          
          {/* PLAY/PAUSE/RESET CONTROLS */}
          <View className="flex-row space-x-6 mt-10">
            <TouchableOpacity 
              onPress={() => timeLeft > 0 && setIsRunning(!isRunning)}
              className={`w-20 h-20 rounded-full justify-center items-center ${isRunning ? 'bg-orange-500/80' : 'bg-sky-500/80'}`}
            >
              <Ionicons name={isRunning ? "pause" : "play"} size={32} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {setIsRunning(false); setTimeLeft(0);}}
              className="w-20 h-20 rounded-full justify-center items-center bg-slate-700/80"
            >
              <Ionicons name="refresh" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PERSONALIZED PRESETS SECTION */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">Presets</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={32} color="#0ea5e9" />
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {presets.map((item) => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => startPreset(item.duration)}
              className="bg-slate-900/80 p-6 rounded-[32px] flex-row justify-between items-center border border-white/10 backdrop-blur-xl"
            >
              <View>
                <Text className="text-white text-xl font-semibold">{item.name}</Text>
                <Text className="text-slate-400 text-sm">{Math.floor(item.duration / 60)} mins</Text>
              </View>
              <Ionicons name="play-circle-outline" size={32} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Preset Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        {/* ... Modal Code remains the same as before ... */}
      </Modal>
    </ImageBackground>
  );
}