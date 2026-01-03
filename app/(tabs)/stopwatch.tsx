import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<any>(null);

  const startStop = () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    setRunning(!running);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(0);
    setRunning(false);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-slate-950 justify-center items-center p-6">
      <Text className="text-white text-6xl font-mono mb-12">{formatTime(time)}</Text>
      
      <View className="flex-row space-x-4">
        <TouchableOpacity 
          onPress={startStop}
          className={`px-12 py-4 rounded-full ${running ? 'bg-red-500' : 'bg-green-500'}`}
        >
          <Text className="text-white font-bold text-lg">{running ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={reset} className="bg-slate-700 px-12 py-4 rounded-full">
          <Text className="text-white font-bold text-lg">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}