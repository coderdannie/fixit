// hooks/useVoiceRecording.ts

import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Alert } from "react-native";

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  cancelRecording: () => Promise<void>;
  playSound: (uri: string, onFinish?: () => void) => Promise<void>;
  stopSound: () => Promise<void>;
  isPlaying: boolean;
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const durationIntervalRef = useRef<any | null>(null);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permissions to record audio."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to get permissions:", error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      console.log("🎤 Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recordingRef.current) return null;

      console.log("🛑 Stopping recording...");

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);

      console.log("✅ Recording stopped, URI:", uri);
      return uri;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsRecording(false);
      return null;
    }
  };

  const cancelRecording = async () => {
    try {
      if (!recordingRef.current) return;

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);

      console.log("❌ Recording cancelled");
    } catch (error) {
      console.error("Failed to cancel recording:", error);
    }
  };

  // ✅ UPDATED: Added onFinish callback
  const playSound = async (uri: string, onFinish?: () => void) => {
    try {
      // Stop any currently playing sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      console.log("🔊 Playing sound:", uri);

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);

      // ✅ FIXED: Set up playback status listener to detect when audio finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          // Check if playback just finished
          if (status.didJustFinish) {
            console.log("✅ Playback finished");
            setIsPlaying(false);

            // Call the onFinish callback if provided
            if (onFinish) {
              onFinish();
            }

            // Clean up the sound
            sound.unloadAsync().catch(console.error);
            soundRef.current = null;
          }
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play sound:", error);
      setIsPlaying(false);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }
  };

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Failed to stop sound:", error);
    }
  };

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    playSound,
    stopSound,
    isPlaying,
  };
};
