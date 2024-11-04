import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, RouteParams } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';

export default function Tab() {
  const [exercises, setExercises] = useState<{ id: string; name: string; target: string; gifUrl: string;}[]>([]);
  const [exerciseState, setExerciseState] = useState<{ [key: string]: boolean }>({});
  const [exerciseSets, setExerciseSets] = useState<{ [key: string]: number[] }>({});

  const { selectedExercise } = useLocalSearchParams<RouteParams<{ selectedExercise: string }>>();

  const toggleState = (exerciseId: string) => {
    setExerciseState((prevState) => ({
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

  const deleteSet = (exerciseId: string) => {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId] || [];
      return {
        ...prevState,
        [exerciseId]: sets.slice(0, sets.length - 1),
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
    <View style={styles.container}>
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
      <ThemedText style={styles.menuTitle} type="title">New Workout</ThemedText>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (

          <View style={[styles.exerciseContainer, exerciseState[item.id] && styles.finished]}>

            {/*Exercise Name and Details*/}

            <View style={styles.containerBox}>
              <View style={styles.exGifContainer}>
                <Image style={styles.exGif} source={{ uri: item.gifUrl }}/>
              </View>
              
              <View style={{ marginLeft: 10 }}>
                <ThemedText style={styles.capitalize} type="subtitle">{item.name}</ThemedText>
                <ThemedText style={styles.capitalize}>{item.target}</ThemedText>
              </View>
            </View>

            {/*Exercise Sets*/}

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
                    
                    onChangeText={(text) => console.log(text)}
                    placeholder="0"
                  />
                </View>
                <View>
                
                  <TextInput
                    style={styles.input}
                    
                    onChangeText={(text) => console.log(text)}
                    placeholder="0"
                  />
                </View>

              </View>
            ))}


            {/*Buttons*/}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>

              <Ionicons style={{padding: 5}} name="add" size={24} color="white" onPress={() => addSet(item.id)}/>
              <Ionicons style={{padding: 5}} name="remove" size={24} color="white" onPress={() => deleteSet(item.id)}/>
              <Ionicons style={{padding: 5}} name="checkmark" size={24} color="white" onPress={() => toggleState(item.id)}/>
              

            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
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
  menuTitle: {
    textAlign: "center",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
    fontSize: 50,
  },
  exGif: {
    width: '100%',
    height: '100%',
  },
  containerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  exGifContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden', // This makes sure the content is clipped to the border radius
  },
  capitalize: {
    textTransform: "capitalize",
  },
});
