import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, RouteParams, router, useFocusEffect, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';

type Exercise = { id: string; name: string; target: string; pic: ImageSourcePropType; };
type ExerciseSet = { [key: string]: { isComplete: boolean; sets: number[] } };

const ExerciseItem = (
  { item, toggleState, addSet, deleteSet, exerciseSets, pic }:
  { item: Exercise; 
    toggleState: (id: string) => void; 
    addSet: (id: string) => void; 
    deleteSet: (id: string) => void; 
    exerciseSets: ExerciseSet;
    pic: ImageSourcePropType;
  }) => (
  <View style={[styles.exerciseContainer, exerciseSets[item.id]?.isComplete && styles.finished]}>
    <TouchableOpacity style={styles.containerBox}
      onPress={() => {
        router.push({
          pathname: '/exerciseDetails',
          params: { item: JSON.stringify(item) },
        });
      }}
    >
      <Image  source={item.pic ? item.pic : require('@/assets/images/icon.png')} style={styles.exGif}/>
      <View style={styles.exerciseInfo}>
        <ThemedText style={styles.capitalize} type="subtitle">{item.name}</ThemedText>
        <ThemedText style={styles.capitalize}>{item.target}</ThemedText>
      </View>
    </TouchableOpacity>

    <View style={styles.setContainer}>
      <ThemedText style={styles.exSet}>Sets</ThemedText>
      <ThemedText style={styles.exSet}>Weight</ThemedText>
      <ThemedText style={styles.exSet}>Reps</ThemedText>
    </View>

    {exerciseSets[item.id]?.sets.map((setNumber) => (
      <View key={setNumber} style={styles.setNumbers}>
        <ThemedText style={styles.setText}>{setNumber}</ThemedText>
        <TextInput style={styles.input} placeholder="0" placeholderTextColor={'white'} onChangeText={(text) => console.log(text)} />
        <TextInput style={styles.input} placeholder="0" placeholderTextColor={'white'} onChangeText={(text) => console.log(text)} />
      </View>
    ))}

    <View style={styles.iconContainer}>
      <Ionicons name="add" size={24} color="white" onPress={() => addSet(item.id)} />
      <Ionicons name="remove" size={24} color="white" onPress={() => deleteSet(item.id)} />
      <Ionicons name="checkmark" size={24} color="white" onPress={() => toggleState(item.id)} />
    </View>
  </View>
);

export default function Tab() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet>({});
  const { selectedExercise } = useLocalSearchParams<RouteParams<{ selectedExercise: string }>>();
  const navigation = useNavigation();

  const toggleState = (exerciseId: string) => {
    setExerciseSets((prevState) => ({
      ...prevState,
      [exerciseId]: { ...prevState[exerciseId], isComplete: !prevState[exerciseId].isComplete },
    }));
  };

  const addSet = (exerciseId: string) => {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId]?.sets || [];
      return { ...prevState, [exerciseId]: { ...prevState[exerciseId], sets: [...sets, sets.length + 1] } };
    });
  };

  const deleteSet = (exerciseId: string) => {
    if(exerciseSets[exerciseId]?.sets.length > 1) {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId]?.sets || [];
      return { ...prevState, [exerciseId]: { ...prevState[exerciseId], sets: sets.slice(0, -1) } };
    });
    } else {
      //ask if you want to remove exercise (this should be a function)
    }
  };

  //TODO
  const removeExercise = (exerciseId: string) => {};

  useEffect(() => {
    if (selectedExercise) {
      const exercise = JSON.parse(selectedExercise);
      setExercises((prevExercises) => [...prevExercises, exercise]);
      setExerciseSets((prevState) => ({
        ...prevState,
        [exercise.id]: { isComplete: false, sets: [1] },
      }));
    }
  }, [selectedExercise]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      // Prevent default behavior of leaving the screen
      event.preventDefault();

      // Show confirmation dialog
      Alert.alert(
        'Discard workout?',
        'Are you sure you want to discard your workout?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Discard', style: 'destructive', onPress: () => router.push('/workouts') },
        ]
      );
    });

    return unsubscribe; // Cleanup listener on component unmount
  }, [navigation, router]);

  return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
      <ThemedText style={styles.menuTitle} type="title">New Workout</ThemedText>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <ExerciseItem 
            item={item} 
            toggleState={toggleState} 
            addSet={addSet} 
            deleteSet={deleteSet} 
            exerciseSets={exerciseSets}
            pic={item.pic}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Link style={styles.buttonNew} href="/exerciseList">Add Exercise</Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  exerciseContainer: { padding: 10, marginVertical: 5 },
  finished: { backgroundColor: "rgba(0, 255, 0, 0.2)" },
  containerBox: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  exerciseInfo: { marginLeft: 10 },
  setContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  setNumbers: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 8 },
  input: { flex: 1, fontSize: 16, color: 'lightgray', fontWeight: 'bold', textAlign: 'center' },
  iconContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  capitalize: { textTransform: "capitalize" },
  menuTitle: { textAlign: "center", padding: 20, paddingTop: 60, paddingBottom: 60, fontSize: 50 },
  exGif: { width: 80, height: 80, borderRadius: 20 },
  exSet: { color: 'lightgray', fontSize: 16, textTransform: 'capitalize' },
  setText: { fontWeight: 'bold', textAlign: 'center' },
  buttonNew: { marginTop: 20, padding: 10, backgroundColor: '#0a7ea4', borderRadius: 5, textAlign: 'center' },
});
