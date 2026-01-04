import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, ImageBackground, Alert, 
  NativeSyntheticEvent, NativeScrollEvent 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../../assets/images/whale-background.jpg');
const ITEM_HEIGHT = 60; 

const hoursArray = Array.from({ length: 24 }, (_, i) => i);
const minsSecsArray = Array.from({ length: 60 }, (_, i) => i);

export default function Timer() {
  const [selH, setSelH] = useState(0);
  const [selM, setSelM] = useState(0);
  const [selS, setSelS] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef<any>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minScrollRef = useRef<ScrollView>(null);
  const secScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Alert.alert("Time's Up!");
    }
    
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (timeLeft > 0) {
        setIsRunning(true);
      } else {
        const totalSeconds = (selH * 3600) + (selM * 60) + selS;
        if (totalSeconds > 0) {
          setTimeLeft(totalSeconds);
          setIsRunning(true);
        } else {
          Alert.alert("Set Time", "Please scroll to select a time first.");
        }
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelH(0); setSelM(0); setSelS(0);
    hourScrollRef.current?.scrollTo({ y: 0, animated: true });
    minScrollRef.current?.scrollTo({ y: 0, animated: true });
    secScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // COLUMN WITH DYNAMIC OPACITY
  const ScrollColumn = ({ data, onSelect, selectedValue, label, scrollRef }: any) => {
    const onScrollUpdate = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      if (index >= 0 && index < data.length) onSelect(data[index]);
    };

    return (
      <View className="items-center mx-3">
        <Text className="text-slate-500 text-[10px] font-bold mb-4 uppercase tracking-widest">{label}</Text>
        <View style={{ height: ITEM_HEIGHT * 3 }} className="w-20 justify-center">
          
          {/* Middle Selector Zone Lines */}
          <View 
            style={{ 
              position: 'absolute', top: ITEM_HEIGHT, height: ITEM_HEIGHT, left: 0, right: 0, 
              borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' 
            }} 
          />

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={onScrollUpdate}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
          >
            {data.map((val: number) => {
              // Compare value to selected state for opacity
              const isSelected = val === selectedValue;
              return (
                <View key={val} style={{ height: ITEM_HEIGHT }} className="justify-center items-center">
                  <Text 
                    style={{ opacity: isSelected ? 1 : 0.2 }} // Low opacity for non-selected
                    className="text-white text-3xl font-light font-mono"
                  >
                    {val.toString().padStart(2, '0')}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundImage} className="flex-1" resizeMode="cover">
      <View className="flex-1 items-center justify-center px-6">
        
        {timeLeft === 0 && !isRunning ? (
          /* PICKER MODE */
          <View className="bg-slate-900/60 p-10 rounded-[50px] border border-white/10 backdrop-blur-3xl flex-row items-center">
            {/* Pass selectedValue to handle the opacity logic */}
            <ScrollColumn data={hoursArray} label="Hours" onSelect={setSelH} selectedValue={selH} scrollRef={hourScrollRef} />
            <ScrollColumn data={minsSecsArray} label="Mins" onSelect={setSelM} selectedValue={selM} scrollRef={minScrollRef} />
            <ScrollColumn data={minsSecsArray} label="Secs" onSelect={setSelS} selectedValue={selS} scrollRef={secScrollRef} />
          </View>
        ) : (
          /* ACTIVE / PAUSED DISPLAY */
          <View className="items-center">
            <Text className="text-white text-8xl font-light font-mono shadow-2xl shadow-black">
              {Math.floor(timeLeft/3600).toString().padStart(2, '0')}:
              {Math.floor((timeLeft%3600)/60).toString().padStart(2, '0')}:
              {(timeLeft%60).toString().padStart(2, '0')}
            </Text>
          
          </View>
        )}

        <View className="flex-row items-center mt-24 space-x-8">
          {/* Constant Button Sizes */}
          <TouchableOpacity onPress={handleReset} className="w-20 h-20 rounded-full bg-slate-800/80 justify-center items-center">
            <Ionicons name="refresh" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={toggleTimer}
            className={`w-20 h-20 rounded-full shadow-2xl justify-center items-center ${isRunning ? 'bg-orange-600/80' : 'bg-emerald-600/80'}`}
          >
            <Ionicons name={isRunning ? "pause" : "play"} size={30} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}