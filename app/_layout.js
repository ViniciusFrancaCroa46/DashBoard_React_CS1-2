import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('Rota atual:', segments.join('/'));
  }, [segments]);

  const showSideMenu = segments.length !== 0;
  
  return (
    <View style={styles.container}>
      <Stack />
      {showSideMenu && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
            <MaterialCommunityIcons name="home-variant" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/coleta')}>
            <MaterialCommunityIcons name="package-variant-closed" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/rota')}>
            <MaterialCommunityIcons name="home-map-marker" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/energia')}>
            <MaterialCommunityIcons name="battery-plus-variant" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    right: 10,
    top: 100,
    justifyContent: 'space-between',
    height: 240,
    backgroundColor: 'rgba(78, 104, 81, 1)',
    borderRadius: 10,
    paddingVertical: 10,
    zIndex: 1000,
  },
  button: {
    padding: 12,
    alignItems: 'center',
  },
});
