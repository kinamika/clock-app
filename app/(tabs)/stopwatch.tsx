import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

const backgroundImage = require('../../assets/images/whale-background.jpg');

export default function Stopwatch() {
  const [overallTime, setOverallTime] = useState(0);
  const [lapTime, setLapTime] = useState(0); 
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<{overall: number, lap: number}[]>([]);
  
  const timerRef = useRef<any>(null);
  // NEW: Add a ref to track the start time of the current lap
  const lapStartRef = useRef<number>(0);
  const overallStartRef = useRef<number>(0);

  const startStop = () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Record the starting moments
      overallStartRef.current = Date.now() - overallTime;
      lapStartRef.current = Date.now() - lapTime;
      
      timerRef.current = setInterval(() => {
        setOverallTime(Date.now() - overallStartRef.current);
        setLapTime(Date.now() - lapStartRef.current);
      }, 10);
    }
    setRunning(!running);
  };

  const handleLap = () => {
    if (running) {
      setLaps([{ overall: overallTime, lap: lapTime }, ...laps]);
      
      // FIX: Reset the lap start reference to "now"
      lapStartRef.current = Date.now();
      setLapTime(0); 
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setOverallTime(0);
    setLapTime(0);
    setLaps([]);
    setRunning(false);
    lapStartRef.current = 0;
    overallStartRef.current = 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={backgroundImage} className="flex-1" resizeMode="cover">
      <View className={`flex-1 p-6 ${laps.length > 0 ? 'justify-start mt-20' : 'justify-center'}`}>
        
        <View className="items-center">
          <Text className="text-white text-6xl font-mono ">
            {formatTime(overallTime)}
          </Text>
          
          <View className="h-10 mt-2">
            {laps.length > 0 && (
              <Text className="text-white text-4xl font-mono">
  {formatTime(lapTime)}
</Text>

            )}
          </View>
          
          <View className="flex-row space-x-6 mt-8 mb-10">
            <TouchableOpacity 
              onPress={startStop}
              className={`w-20 h-20 rounded-full justify-center items-center ${running ? 'bg-red-500/80' : 'bg-green-500/80'}`}
            >
              <Text className="text-white font-bold">{running ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={running ? handleLap : reset} 
              className="bg-slate-700/80 w-20 h-20 rounded-full justify-center items-center"
            >
              <Text className="text-white font-bold">{running ? 'Lap' : 'Reset'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {laps.length > 0 && (
          <View className="w-full flex-1 max-h-[50%] bg-black/30 rounded-3xl border border-white/20 overflow-hidden backdrop-blur-md">
            <View className="flex-row justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <Text className="text-slate-400 font-bold text-xs uppercase">Lap</Text>
              <Text className="text-slate-400 font-bold text-xs uppercase">Split</Text>
              <Text className="text-slate-400 font-bold text-xs uppercase">Total</Text>
            </View>

            <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 30 }}>
              {laps.map((item, index) => (
                <View key={index} className="flex-row justify-between py-4 border-b border-white/5">
                  <Text className="text-slate-400 font-medium">#{laps.length - index}</Text>
                  <Text className="text-[#e9c949] font-mono">{formatTime(item.lap)}</Text>
                  <Text className="text-white font-mono">{formatTime(item.overall)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}