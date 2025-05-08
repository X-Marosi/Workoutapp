import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ImageSourcePropType, Text, Modal, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useWorkout } from '@/context/workoutContext';

type Exercise = { id: string; name: string; target: string; pic: ImageSourcePropType };
type SetDetails = { setNumber: number; rpe: number; weight: number; reps: number };
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
  updateSetDetails: (exerciseId: string, setNumber: number, field: 'weight' | 'reps' | 'rpe', value: number) => void;
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
      <ThemedText style={styles.exSet}>RPE</ThemedText>
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
          value={set.rpe ? set.rpe.toString() : ''}
          keyboardType="numeric"
          onChangeText={(text) =>
            updateSetDetails(item.id, set.setNumber, 'rpe', parseInt(text) || 0)
          }
        />
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="white"
          value={set.weight ? set.weight.toString() : ''}
          keyboardType="numeric"
          onChangeText={(text) =>
            updateSetDetails(item.id, set.setNumber, 'weight', parseInt(text) || 0)
          }
        />
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="white"
          value={set.reps ? set.reps.toString() : ''}
          keyboardType="numeric"
          onChangeText={(text) =>
            updateSetDetails(item.id, set.setNumber, 'reps', parseInt(text) || 0)
          }
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
  const { 
    exercises, 
    exerciseSets, 
    totalWeight, 
    totalSets,
    elapsedTime,
    timerState,
    workoutName,
    toggleState,
    addSet,
    deleteSet,
    updateSetDetails,
    setWorkoutName,
    setTimerState,
    addExercise,
    resetWorkout,
    loadWorkoutPlan
  } = useWorkout();
  
  const { selectedExercise } = useLocalSearchParams<{ selectedExercise: string }>();
  const { selectedWorkout } = useLocalSearchParams<{ selectedWorkout: string }>();
  const navigation = useNavigation();
  const user = auth().currentUser;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Format time function
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Finish workout function
  const finishWorkout = async (saveAsPlan: boolean) => {
    const workoutData = {
      name: workoutName || 'Unnamed Workout',
      createdAt: new Date(),
      volume: totalWeight,
      duration: formatTime(elapsedTime),
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exerciseSets[exercise.id]?.sets.map((set) => ({
          weight: set.weight,
          setNumber: set.setNumber,
          reps: set.reps,
          rpe: set.rpe,
        })),
        pic: exercise.pic || null,
      })),
    };

    // Save as a workout
    await firestore().collection('users').doc(user?.uid).collection('workouts').add(workoutData);

    // Save as a workout plan
    if (saveAsPlan && selectedWorkout) {
      await firestore().collection('users').doc(user?.uid).collection('workoutPlans').doc(selectedWorkout).update(workoutData);
    }
    else if (saveAsPlan) {
      await firestore().collection('users').doc(user?.uid).collection('workoutPlans').add(workoutData);
    }

    resetWorkout(); // Reset the workout before navigating away
    router.push('/workouts');
  };

  // Add selected exercise from params
  useEffect(() => {
    if (selectedExercise && selectedExercise !== 'null') {
      try {
        const exercise = JSON.parse(selectedExercise);
        addExercise(exercise);
      } catch (e) {
        console.error("Error parsing selected exercise:", e);
      }
    }
  }, [selectedExercise]);

  // Load workout plan
  useEffect(() => {
    if (selectedWorkout && selectedWorkout !== 'null') {
      const workoutRef = firestore().collection('users').doc(user?.uid).collection('workoutPlans').doc(selectedWorkout);
      
      workoutRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const planExercises = data?.exercises || [];
          const name = data?.name || 'Workout Plan';
          
          // Convert data to the format needed for context
          const planSets = planExercises.reduce((acc: Record<string, ExerciseSet>, exercise: any) => {
            acc[exercise.id] = {
              isComplete: false,
              sets: exercise.sets.map((set: any) => ({
                ...set,
                rpe: set.rpe ?? 0,
              })),
            };
            return acc;
          }, {});
          
          // Load the workout plan into context
          loadWorkoutPlan(planExercises, planSets, name);
        }
      });
    }
  }, [selectedWorkout]);

  // Handle back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();
      Alert.alert(
        'Discard workout?',
        'Are you sure you want to discard your workout?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { 
            text: 'Discard', 
            style: 'destructive', 
            onPress: () => {
              resetWorkout();
              navigation.dispatch(event.data.action); 
            } 
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
      <View style={styles.containerData}>
        <View>
          <ThemedText style={styles.infoTitle} type="default">Duration</ThemedText>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText style={styles.infoData} type="default"> {formatTime(elapsedTime)}</ThemedText>
            {timerState === 'running' ? 
              <Ionicons name="pause" size={18} color="white" style={{margin: -6}} onPress={() => setTimerState('paused')} />
              :
              <Ionicons name="play" size={18} color="white" style={{margin: -6}} onPress={() => setTimerState('running')} />
            }
          </View>

        </View>

        <View>
          <ThemedText style={styles.infoTitle} type="default">Volume</ThemedText>
          <ThemedText style={styles.infoData} type="default"> {totalWeight+'kg'} </ThemedText>
        </View>

        <View>
          <ThemedText style={styles.infoTitle} type="default">Sets</ThemedText>
          <ThemedText style={styles.infoData} type="default"> {totalSets} </ThemedText>
        </View>

        <Text style={styles.buttonFinish} onPress={() => {selectedWorkout? finishWorkout(true) : setIsModalVisible(true)}}>Finish</Text>
      </View>

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
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity style={styles.buttonAdd} onPress={() => router.push('/exerciseList')}>
            <Text style={styles.buttonAddText}>Add Exercise</Text>
          </TouchableOpacity>
        }
        ListHeaderComponent={
          <ThemedText style={styles.menuTitle} type="title">{workoutName || 'New Workout'}</ThemedText>
        }
      />

      {/* Modal for Saving Workout */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <KeyboardAvoidingView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Workout</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Workout Name"
              placeholderTextColor="gray"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => finishWorkout(false)}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalButton } onPress={() => finishWorkout(true)}>
                <Text style={styles.modalButtonText}>Save as Plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#222' }]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  exerciseContainer: {
    padding: 10,
    marginVertical: 5
  },
  finished: {
    backgroundColor: "rgba(40, 191, 55, 0.25)"
  },
  containerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16 ,
    width: '100%'
  },
  exerciseInfo: { 
    marginLeft: 10, 
    width: '70%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  setNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'lightgray',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 6,
    paddingTop: 14
  },
  capitalize: {
    textTransform: "capitalize"
  },
  menuTitle: {
    textAlign: "center",
    padding: 20,
    paddingTop: 30,
    fontSize: 50,
    lineHeight: 50
  },
  exPic: {
    width: 60,
    height: 60,
    borderRadius: 20
  },
  exSet: { 
    color: 'lightgray',
    fontSize: 16,
    textTransform: 'capitalize'
  },
  setText: { 
    fontWeight: 'bold',
    textAlign: 'center'
  },
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
    marginVertical: 20,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#101010',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    borderColor: 'transparent',
    backgroundColor: '#222',
    borderRadius: 5,
    width: '100%',
    padding: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#663399',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});