import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';

const backgroundImage = require('../../assets/images/whale-background.jpg');

export default function WorldClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return date.toLocaleTimeString('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      className="flex-1"
      resizeMode="cover" 
    >
      {/* paddingBottom: 120 ensures the list clears the high navbar */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
      >
        <Text className="text-white text-4xl font-bold mb-8 mt-12 ">
          World Clock
        </Text>

        <View className="space-y-4">
          {[
            { label: 'Local Time (PH)', zone: 'Asia/Manila', color: 'text-sky-400' },
            { label: 'New York', zone: 'America/New_York', color: 'text-white' },
            { label: 'London', zone: 'Europe/London', color: 'text-white' }
          ].map((item, index) => (
            <View 
              key={index}
              className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-xl mb-4"
            >
              <Text className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                {item.label}
              </Text>
              <Text className={`${item.color} text-4xl font-mono mt-2`}>
                {formatTime(time, item.zone)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}