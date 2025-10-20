// hooks/useAsyncStorage.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = (key: string, initialValue: string | null = null) => {
  const [storedValue, setStoredValue] = useState<string | null>(initialValue);

  const setValue = async (value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      setStoredValue(value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  const getValue = async () => {
    try {
      const value = await AsyncStorage.getItem(key);
      setStoredValue(value);
      return value;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  };

  useEffect(() => {
    getValue();
  }, [key]);

  return { storedValue, setValue, getValue, removeValue };
};