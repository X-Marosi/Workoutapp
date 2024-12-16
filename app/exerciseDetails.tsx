// exerciseDetails.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Video from 'react-native-video';
import Body from "react-native-body-highlighter";
import { useUser } from '@/context/userContext';

export default function ExerciseDetails() {
  const { item } = useLocalSearchParams<{ item: string }>();
  const exercise = item ? JSON.parse(item) : {};
  const { gender } = useUser();

  return (
    <ScrollView>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
          <ThemedText style={styles.exName} type="title">{exercise.name}</ThemedText>
          <View style={styles.container}>
              
            { exercise.video ? (
                <Video
                  source={exercise.video}
                  style={{ width: '95%', height: 243, backgroundColor: '#222', borderRadius: 6, overflow: 'hidden', alignSelf: 'center' }}
                  resizeMode="contain"
                  repeat
                />
            ) : null
            }

            <View style={{ alignItems: 'center',    backgroundColor: '#222', borderRadius: 6, margin: 10,  }}>
              <ThemedText style={{fontSize: 24, paddingTop:20, fontWeight: 'bold'}}>Targeted muscles</ThemedText>
              <View style={styles.body}>
                <Body
                  data={[
                    { slug: exercise.target, intensity: 3 },
                    { slug: exercise.secondaryMuscles[0], intensity: 2 },
                    { slug: exercise.secondaryMuscles[1], intensity: 1 },
                    { slug: exercise.secondaryMuscles[2], intensity: 1 },
                    { slug: exercise.secondaryMuscles[3], intensity: 1 },
                  ]}
                  gender= {gender}
                  side="front"
                  scale={1}
                  border="#111"
                />
                <Body
                  data={[
                    { slug: exercise.target, intensity: 3 },
                    { slug: exercise.secondaryMuscles[0], intensity: 2 },
                    { slug: exercise.secondaryMuscles[1], intensity: 1 },
                    { slug: exercise.secondaryMuscles[2], intensity: 1 },
                    { slug: exercise.secondaryMuscles[3], intensity: 1 },
                  ]}
                  gender= {gender}
                  side="back"
                  scale={1}
                  border="#111"
                />
              </View>
            </View>

            <View style={styles.card}>
              <ThemedText style={styles.text}>Target muscle: {exercise.target}</ThemedText>
              <ThemedText style={styles.text}>Secondary Muscles: {exercise.secondaryMuscles.join(', ')}</ThemedText>
              <ThemedText style={styles.text}>Equipment: {exercise.equipment}</ThemedText>
            </View>
            <View style={styles.card}>
              <ThemedText style={{fontSize: 24, paddingVertical:20, fontWeight: 'bold', alignSelf: 'center'}}>Instructions</ThemedText>
              <ThemedText style={styles.text && {fontSize: 16}}>{exercise.instructions.join('\n')}</ThemedText>
            </View>

          </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 0 
  },
  exName: {
      textAlign: 'center',
      marginTop: 80,
      padding: 20,
      fontSize: 36,
      textTransform: "capitalize"
  },
  text: { 
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: "capitalize"
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 10,
    margin: 10,    
  },
  body: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
