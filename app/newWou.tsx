import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ImageSourcePropType, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type Exercise = { id: string; name: string; target: string; pic: ImageSourcePropType };
type SetDetails = { setNumber: number; weight: number; reps: number };
type ExerciseSet = { isComplete: boolean; sets: SetDetails[] };

const ExerciseItem = ({
  item, 
  toggleState, 
  addSet, 
  deleteSet, 
  exerciseSets, 
  updateSetDetails,
}: {
  item: Exercise;
  toggleState: (id: string) => void;
  addSet: (id: string) => void;
  deleteSet: (id: string) => void;
  exerciseSets: Record<string, ExerciseSet>;
  updateSetDetails: (exerciseId: string, setNumber: number, field: 'weight' | 'reps', value: number) => void;
  updateVolume: () => void;
}) => (
  <View style={[styles.exerciseContainer, exerciseSets[item.id]?.isComplete && styles.finished]}>
    <TouchableOpacity
      style={styles.containerBox}
      onPress={() => router.push({ pathname: '/exerciseDetails', params: { item: JSON.stringify(item) } })}
    >
      <Image source={item.pic || require('@/assets/images/icon.png')} style={styles.exPic} />
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

    {exerciseSets[item.id]?.sets.map((set) => (
      <View key={set.setNumber} style={styles.setNumbers}>
        <ThemedText style={styles.setText}>{set.setNumber}</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="white"
          value={set.weight ? set.weight.toString() : ''} // Empty string if weight is 0
          keyboardType="numeric"
          onChangeText={(text) => updateSetDetails(item.id, set.setNumber, 'weight', parseInt(text) || 0)} // Default to 0
        />
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="white"
          value={set.reps ? set.reps.toString() : ''} // Empty string if reps is 0
          keyboardType="numeric"
          onChangeText={(text) => updateSetDetails(item.id, set.setNumber, 'reps', parseInt(text) || 0)} // Default to 0
        />
      </View>
    ))}

    <View style={styles.iconContainer}>
      <Ionicons style={styles.icon} name="add" size={32} color="white" onPress={() => addSet(item.id)} />
      <Ionicons style={styles.icon} name="remove" size={32} color="white" onPress={() => deleteSet(item.id)} />
      <Ionicons style={styles.icon} name="checkmark" size={32} color="white" onPress={() => toggleState(item.id)} />
    </View>
  </View>
);

export default function Tab() {
  const user = auth().currentUser;
  const { selectedExercise } = useLocalSearchParams<{ selectedExercise: string }>();
  const { selectedWorkout } = useLocalSearchParams<{ selectedWorkout: string }>();
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<Record<string, ExerciseSet>>({});
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const nameWorkout = () => {
    let time = new Date().getHours();

    if (time >= 6 && time < 12) {
      return "Morning Workout";
    }
    else if (time > 12 && time <= 18) {
      return "Afternoon Workout";
    }
    else if (time > 18 || time < 6) {
      return "Evening Workout";
    }
  };

  const updateVolume = () => {
    let total = 0;
    exercises.forEach((exercise) => {
      const exerciseData = exerciseSets[exercise.id];
      if (exerciseData?.isComplete) {
        exerciseData.sets.forEach((set) => {
          total += set.weight * set.reps;
        });
      }
    });
    setTotalWeight(total);
  };

  const updateTotalSets = () => {
    let total = 0;
    exercises.forEach((exercise) => {
      const exerciseData = exerciseSets[exercise.id];
      if (exerciseData?.isComplete) {
        total += exerciseData.sets.length;
      }
    });
    setTotalSets(total);
  };

  const updateSetDetails = (exerciseId: string, setNumber: number, field: 'weight' | 'reps', value: number) => {
    setExerciseSets((prev) => {
      const updatedSets = prev[exerciseId]?.sets.map((set) =>
        set.setNumber === setNumber ? { ...set, [field]: value || 0 } : set // Default to 0 if input is cleared
      ) || [];
      return { ...prev, [exerciseId]: { ...prev[exerciseId], sets: updatedSets } };
    });
  };

  const toggleState = (exerciseId: string) => {
    setExerciseSets((prevState) => ({
      ...prevState,
      [exerciseId]: { ...prevState[exerciseId], isComplete: !prevState[exerciseId].isComplete },
    }));
  };

  const addSet = (exerciseId: string) => {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId]?.sets || [];
      const newSetNumber = sets.length + 1;
      return {
        ...prevState,
        [exerciseId]: {
          ...prevState[exerciseId],
          sets: [...sets, { setNumber: newSetNumber, weight: 0, reps: 0 }],
        },
      };
    });
  };

  const deleteSet = (exerciseId: string) => {
    if(exerciseSets[exerciseId]?.sets.length > 1) {
    setExerciseSets((prevState) => {
      const sets = prevState[exerciseId]?.sets || [];
      return { ...prevState, [exerciseId]: { ...prevState[exerciseId], sets: sets.slice(0, -1) } };
    });
    } else {
      removeExercise(exerciseId);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== exerciseId));
    setExerciseSets((prevState) => {
      const newState = { ...prevState };
      delete newState[exerciseId];
      return newState;
    });
    router.setParams({ selectedExercise: null });
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

  const uploadWorkout = async () => {
    const workoutData = {
      name: nameWorkout(),
      createdAt: firestore.FieldValue.serverTimestamp(),
      volume: totalWeight,
      duration: formatTime(elapsedTime),
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exerciseSets[exercise.id].sets.map((set) => ({
          weight: set.weight,
          setNumber: set.setNumber,
          reps: set.reps,
        })),
      })),
    };

    //If workout is an existing workout plan, update the workout plan
    if (selectedWorkout && selectedWorkout !== 'null') {
      workoutData.name = 'Workout Plan';
      await firestore().collection('users').doc(user?.uid).collection('workouts').add(workoutData);
      await firestore().collection('users').doc(user?.uid).collection('workoutPlans').doc(selectedWorkout).update(workoutData);
      router.push('/workouts');
      return;
    }

    //Save workout as Workout Plan?
    Alert.alert(
      'Save workout?',
      'Do you want to save this workout as a workout plan?',
      [
        { text: "Back", style: 'cancel', onPress: () => {} },
        { text: "Don't save", onPress: async () => {
          await firestore().collection('users').doc(user?.uid).collection('workouts').add(workoutData);
          await firestore().collection('users').doc(user?.uid).update({ workouts: firestore.FieldValue.increment(1) });
          router.push('/workouts');
        } },
        { text: 'Save', onPress: async () => {
          workoutData.name = 'Workout Plan';
          await firestore().collection('users').doc(user?.uid).collection('workouts').add(workoutData);
          await firestore().collection('users').doc(user?.uid).collection('workoutPlans').add(workoutData);
          await firestore().collection('users').doc(user?.uid).update({ workouts: firestore.FieldValue.increment(1) });
          router.push('/workouts');
        } },
      ]
    );
  };

  useEffect(() => {
    if (selectedExercise && selectedExercise !== 'null') {
      const exercise = JSON.parse(selectedExercise);
      setExercises((prevExercises) => [...prevExercises, exercise]);
      setExerciseSets((prevState) => ({
        ...prevState,
        [exercise.id]: { isComplete: false, sets: [{ setNumber: 1, weight: 0, reps: 0 }] },
      }));
    }
  }, [selectedExercise]);

  useEffect(() => {
    if (selectedWorkout && selectedWorkout !== 'null') {
      const workoutRef = firestore().collection('users').doc(user?.uid).collection('workoutPlans').doc(selectedWorkout);

      workoutRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setExercises(data?.exercises || []);
          setExerciseSets(
            data?.exercises.reduce((acc: Record<string, ExerciseSet>, exercise: { id: string, sets: SetDetails[] }) => {
            acc[exercise.id] = { isComplete: false, sets: exercise.sets };
              return acc;
            }, {})
          );
        }
      });
    }
  }, [selectedWorkout]);

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

  useEffect(() => {
    updateVolume();
    updateTotalSets();
  }, [exerciseSets]);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(Math.floor((currentTime - startTime) / 1000)); // Calculate elapsed time in seconds
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  
  return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

      <View style={styles.containerData}>
        <View>
          <ThemedText style={styles.infoTitle} type="default">Duration</ThemedText>
          <ThemedText style={styles.infoData} type="default"> {formatTime(elapsedTime)}</ThemedText>
        </View>

        <View>
          <ThemedText style={styles.infoTitle} type="default">Volume</ThemedText>
          <ThemedText style={styles.infoData} type="default"> {totalWeight+'kg'} </ThemedText>
        </View>

        <View>
          <ThemedText style={styles.infoTitle} type="default">Sets</ThemedText>
          <ThemedText style={styles.infoData} type="default"> {totalSets} </ThemedText>
        </View>

        <Text style={styles.buttonFinish} onPress={() => {uploadWorkout()}}>Finish</Text>
      </View>

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
            updateSetDetails={updateSetDetails}
            updateVolume={updateVolume}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity style={styles.buttonAdd} onPress={() => router.push('/exerciseList')}>
            <Text style={styles.buttonAddText}>Add Exercise</Text>
          </TouchableOpacity>
        }
      />


      
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  exerciseContainer: { padding: 10, marginVertical: 5 },
  finished: { backgroundColor: "rgba(40, 191, 55, 0.25)" },
  containerBox: { flexDirection: "row", alignItems: "center", marginBottom: 16 , width: '100%'},
  exerciseInfo: { 
    marginLeft: 10, 
    width: '70%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  setContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  setNumbers: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 8 },
  input: { flex: 1, fontSize: 16, color: 'lightgray', fontWeight: 'bold', textAlign: 'right' },
  iconContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  icon: { marginHorizontal: 6, paddingTop: 14 },
  capitalize: { textTransform: "capitalize" },
  menuTitle: { textAlign: "center", padding: 20, paddingTop: 30, fontSize: 50 },
  exPic: { width: 60, height: 60, borderRadius: 20 },
  exSet: { color: 'lightgray', fontSize: 16, textTransform: 'capitalize' },
  setText: { fontWeight: 'bold', textAlign: 'center' },
  buttonFinish: { 
    marginTop: 10,
    height: 40,
    width: 75,
    backgroundColor: 'rebeccapurple', 
    borderRadius: 5, 
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
   },
   buttonAdd: {
    height: 40,
    width: 140,
    backgroundColor: 'rebeccapurple',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20, // Spacing from the list and other content
  },
  buttonAddText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  
  containerData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingTop: 50
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  infoData: {
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
  }
});