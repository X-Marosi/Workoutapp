import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, RouteParams } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';

export default function Tab() {
  const [exercises, setExercises] = useState<{ id: string; name: string; target: string; equipment: string;}[]>([]);
  const [finishedItems, setFinishedItems] = useState<{ [key: string]: boolean }>({});
  const [exerciseSets, setExerciseSets] = useState<{ [key: string]: number[] }>({});

  const { selectedExercise } = useLocalSearchParams<RouteParams<{ selectedExercise: string }>>();

  const toggleFinished = (exerciseId: string) => {
    setFinishedItems((prevState) => ({
      ...prevState,
      [exerciseId]: !prevState[exerciseId],
    }));
  };

  const addSet = (exerciseId: string) => {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId] || [];
      return {
        ...prevState,
        [exerciseId]: [...sets, sets.length + 1],
      };
    });
  };

  useEffect(() => {
    if (selectedExercise) {
      const exercise = JSON.parse(selectedExercise);
      setExercises((prevExercises) => [...prevExercises, exercise]);
    }
  }, [selectedExercise]);

  return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <View style={[styles.exerciseContainer, finishedItems[item.id] && styles.finished]}>
            <ThemedText style={styles.exName}>{item.name}</ThemedText>
            <ThemedText style={styles.exDetails} >{item.target} | {item.equipment}</ThemedText>
            <View style={styles.setContainer}>
              <ThemedText style={styles.exSet}>Sets</ThemedText>
              <ThemedText style={styles.exSet}>Weight</ThemedText>
              <ThemedText style={styles.exSet}>Reps</ThemedText>
            </View>
            
            {exerciseSets[item.id]?.map((setNumber) => (
              <View key={setNumber} style={styles.setNumbers}>
                
                <View>
                  <ThemedText style={{fontWeight: 'bold',textAlign: 'center'}}>{setNumber}</ThemedText>
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    value={'0'}
                    onChangeText={(text) => console.log(text)}
                    placeholder="0"
                  />
                </View>
                <View>
                
                  <TextInput
                    style={styles.input}
                    value={'0'}
                    onChangeText={(text) => console.log(text)}
                    placeholder="0"
                  />
                </View>

              </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => addSet(item.id)}>
                <ThemedText style={styles.addSetButton}>Add Set</ThemedText>
              </TouchableOpacity>
              <Ionicons
                name="checkmark"
                size={24}
                color="white"
                onPress={() => toggleFinished(item.id)}
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Link style={styles.buttonNew} href="/exerciseList">
        Add Exercise
      </Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exerciseContainer: {
    padding: 10,
    marginVertical: 5,
  },
  setNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 8,
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  finished: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'lightgray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 10,
    color: '#0a7ea4',
    textAlign: 'center',
  },
  buttonNew: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0a7ea4',
    borderRadius: 5,
    textAlign: 'center',
  },
  exName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  exDetails: {
    color: 'white',
    textTransform: 'capitalize',
    fontSize: 18,
  },
  exSet: {
    color: 'lightgray',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  
});
