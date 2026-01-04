import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../../assets/images/whale-background.jpg');

// Use your verified key from the screenshot
const API_KEY = '6f5fdf51df5f2868ec868f9df7f37487';

const SUGGESTED_CITIES = ["Tokyo", "Seoul", "Paris", "London", "New York", "Sydney"];

export default function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Starting with Manila as a default so the screen isn't empty
  const [activeCities, setActiveCities] = useState([
    { id: 1, name: 'Manila', temp: '28°', weather: 'Clear', offset: 28800 }
  ]);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCityData = async (cityName?: string) => {
    const query = cityName || searchQuery;
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
      );
      
      const data = await response.json();

      if (response.ok) {
        // Only add if it's not a duplicate
        if (!activeCities.find(c => c.id === data.id)) {
          setActiveCities(prev => [...prev, {
            id: data.id,
            name: data.name,
            temp: `${Math.round(data.main.temp)}°`,
            weather: data.weather[0].main,
            offset: data.timezone,
          }]);
        }
        setModalVisible(false);
        setSearchQuery('');
      } else {
        // Detailed error for debugging the 401 issue
        if (data.cod === "401") {
          Alert.alert("API Still Activating", "OpenWeather keys can take 30-60 minutes to start working. Please try again soon!");
        } else {
          Alert.alert("City Not Found", data.message);
        }
      }
    } catch (error) {
      Alert.alert("Network Error", "Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const getCityTime = (offsetInSeconds: number) => {
    const localTime = new Date();
    const utcTime = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (offsetInSeconds * 1000));
    return cityTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getWeatherIcon = (weather: string, offset: number) => {
    const localTime = new Date();
    const utcTime = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (offset * 1000));
    const hour = cityTime.getHours();

    if (hour >= 18 || hour < 6) return { name: 'moon', color: '#cbd5e1' };
    
    switch (weather.toLowerCase()) {
      case 'clouds': return { name: 'cloudy', color: '#94a3b8' };
      case 'rain': return { name: 'rainy', color: '#60a5fa' };
      case 'thunderstorm': return { name: 'thunderstorm', color: '#fbbf24' };
      default: return { name: 'sunny', color: '#fbbf24' };
    }
  };

  return (
    <ImageBackground source={backgroundImage} className="flex-1" resizeMode="cover">
      <Pressable onPress={() => setOpenMenuId(null)} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 150 }}>
          
          <View className="items-center mb-10">
            <Text className="text-white text-7xl font-light font-mono shadow-xl shadow-black">
              {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Text>
            <Text className="text-slate-300 text-lg uppercase tracking-widest">Local Time</Text>
          </View>

          <View className="flex-row justify-end mb-6">
            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-white/10 p-3 rounded-full border border-white/20">
              <Ionicons name="add" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {activeCities.map((item) => {
            const icon = getWeatherIcon(item.weather, item.offset);
            return (
              <View key={item.id} className="relative mb-4">
                <View className="bg-slate-900/80 p-6 rounded-[32px] flex-row justify-between items-center border border-white/10">
                  <View className="flex-row items-center space-x-4">
                    <Ionicons name={icon.name as any} size={30} color={icon.color} />
                    <View>
                      <Text className="text-white text-2xl font-bold">{item.name}</Text>
                      <Text className="text-slate-400 text-sm">{item.weather}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center space-x-3">
                    <View className="items-end mr-2">
                      <Text className="text-white text-3xl font-mono">{getCityTime(item.offset)}</Text>
                      <Text className="text-sky-400 text-sm font-bold">{item.temp}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setOpenMenuId(openMenuId === item.id ? null : item.id)} className="p-2">
                      <Ionicons name="ellipsis-vertical" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {openMenuId === item.id && (
                  <View className="absolute right-6 top-14 bg-slate-800 rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden">
                    <TouchableOpacity 
                      onPress={() => { setActiveCities(prev => prev.filter(c => c.id !== item.id)); setOpenMenuId(null); }} 
                      className="flex-row items-center p-4 bg-slate-800"
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      <Text className="text-red-500 font-bold ml-2">Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </Pressable>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end">
          <View className="bg-slate-900 h-2/3 rounded-t-[40px] p-8 border-t border-white/10">
            <Text className="text-white text-2xl font-bold mb-6">Select City</Text>
            <TextInput 
              placeholder="Search city..." 
              placeholderTextColor="#64748b" 
              className="bg-slate-800 p-4 rounded-2xl mb-6 text-white text-lg" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
              onSubmitEditing={() => fetchCityData()} 
            />
            <FlatList
              data={SUGGESTED_CITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => fetchCityData(item)} className="py-4 border-b border-white/5 flex-row justify-between">
                  <Text className="text-white text-lg">{item}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#475569" />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 items-center">
              <Text className="text-slate-500 font-bold">Close</Text>
            </TouchableOpacity>
          </View>
          {loading && (
            <View className="absolute inset-0 justify-center items-center bg-black/30">
              <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
          )}
        </View>
      </Modal>
    </ImageBackground>
  );
}