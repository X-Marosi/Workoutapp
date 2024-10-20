import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import { useRouter, RouteParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Tab() {

  const [exercises, setExercises] = useState<{ id: string; name: string; target: string; equipment: string; uniqueId: string }[]>([]);
  
  const { selectedExercise } = useLocalSearchParams<RouteParams<{ selectedExercise: string }>>();
  
  useEffect(() => {
    if (selectedExercise) {
      const exercise = JSON.parse(selectedExercise);
      // normal setExercises (doesn't accept duplicates)
      setExercises((prevExercises) => [...prevExercises, exercise]);
      //setExercises((prevExercises) => [...prevExercises, { ...exercise, uniqueId: `${exercise.id}-${Date.now()}` }]);
      //console.log(exercise.uniqueId);
    }
  }, [selectedExercise]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>

        <ThemedText style={styles.menuTitle} type="title">
          New Workout
        </ThemedText>

        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <View>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText>{item.target} | {item.equipment}</ThemedText>
            </View>
          )}
          keyExtractor={(item) => item.uniqueId}
        />
        <Link style={styles.buttonNew} href="/exerciseList">
          Add Exercise
        </Link>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  menuTitle: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    margin: 10,
  },

  buttonNew: {
    color: "white",
    backgroundColor: "cornflowerblue",
    borderRadius: 8,
    padding: 5,
    margin: 10,
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
});
