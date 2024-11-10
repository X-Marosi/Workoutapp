// exerciseDetails.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Video from 'react-native-video';

export default function ExerciseDetails() {
  const { item } = useLocalSearchParams<{ item: string }>();
  const exercise = item ? JSON.parse(item) : {};

  return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
        <ThemedText style={styles.exName} type="title">{exercise.name}</ThemedText>
        <View style={styles.container}>
            
            { exercise.video ? (
              <Video
                  source={exercise.video}
                  style={{ width: '100%', height: 256}}
                  resizeMode="contain"
                  repeat
              />
            ) : null
          }
            <ThemedText style={styles.text}>Target: {exercise.target}</ThemedText>
            <ThemedText style={styles.text}>Equipment: {exercise.equipment}</ThemedText>
            <ThemedText style={styles.text}>Secondary Muscles: {exercise.secondaryMuscles.join(', ')}</ThemedText>
            <ThemedText style={styles.text}>Instructions:{'\n'} {exercise.instructions.join('\n')}</ThemedText>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  title: { fontSize: 24, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 5, textTransform: "capitalize" },
  exName: { textAlign: "center", padding: 20, paddingTop: 60, paddingBottom: 60, fontSize: 32, textTransform: "capitalize" },
});
