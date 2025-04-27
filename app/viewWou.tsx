import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export default function ViewWorkout() {
    const user = auth().currentUser;
    const { id: workoutId } = useLocalSearchParams<{ id: string }>(); // Extract workoutId from URL params
    const [data, setData] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const [volume, setVolume] = useState('');
    const [duration, setDuration] = useState('00:00:00');


    useEffect(() => {
    if (workoutId) {
        const unsubscribe = firestore().collection('users').doc(user?.uid).collection('workouts').doc(workoutId)
        .onSnapshot(querySnapshot => {
            const fetchedData = querySnapshot.data();
            if (fetchedData) {
                setData(fetchedData.exercises || []);
                setWorkoutName(fetchedData.name || '');
                setVolume(fetchedData.volume || '');
                setDuration(fetchedData.duration || '00:00:00');
            } else {
                // If workout not found in 'workouts', check 'workoutPlans'
                firestore().collection('users').doc(user?.uid).collection('workoutPlans').doc(workoutId)
                .onSnapshot(planSnapshot => {
                    const planData = planSnapshot.data();
                    if (planData) {
                        setData(planData.exercises || []);
                        setWorkoutName(planData.name || '');
                        setVolume(planData.volume || '');
                        setDuration(planData.duration || '00:00:00');
                    }
                });
            }
        });

        return () => unsubscribe(); // Cleanup the Firestore listener on unmount
    }
    }, [workoutId]);
    const renderExercise = ({ item }: { item: { id: string; name: string; pic: number; sets: { weight: number; reps: number }[] } }) => {
        console.log('Exercise picture data:', item.pic);
        return (
            <View style={styles.exerciseContainer}>
                <View style={styles.exerciseHeader}>
                    <Image source={item.pic || require('@/assets/images/icon.png')} style={styles.exPic} />
                    <ThemedText style={styles.exerciseTitle}>{item.name}</ThemedText>
                </View>

                <View style={styles.setContainer}>
                    <View style={styles.setRow}>
                        <Text style={[styles.setHeader, styles.headerIndex]}>Set</Text>
                        <Text style={styles.setHeader}>Weight</Text>
                        <Text style={styles.setHeader}>Reps</Text>
                    </View>
                    {item.sets.map((set, index) => (
                        <View key={index} style={styles.setRow}>
                            <Text style={[styles.setCell, styles.cellIndex]}>{index + 1}</Text>
                            <Text style={styles.setCell}>{set.weight}kg</Text>
                            <Text style={styles.setCell}>{set.reps}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    

    return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>


        <FlatList
        data={data}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
            <Text style={styles.emptyMessage}>No exercises found in this workout.</Text>
        }
        ListHeaderComponent={
            <View>
                <ThemedText style={styles.menuTitle} type="title">{workoutName}</ThemedText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20,  }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Volume: {volume}kg</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Duration: {duration}</Text>
                </View>
            </View>
        }
        />
    </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 },
  menuTitle: {
    textAlign: "center",
    padding: 40,
    marginTop: 80,
    paddingBottom: 70,
    fontSize: 40,
  },
  exerciseContainer: { 
    marginBottom: 20,
    marginHorizontal: 20, 
    paddingVertical: 10,
  },
  exerciseHeader: { 
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
  exerciseTitle: { 
    fontSize: 22, 
    color: 'white', 
    fontWeight: 'bold', 
    textTransform: 'capitalize'
  },
  setContainer: { 
    marginTop: 10 
},
  setRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  setHeader: { flex: 1, fontWeight: 'bold', color: 'lightgray', textAlign: 'center' },
  setCell: { flex: 1, color: 'white', textAlign: 'center' },
  headerIndex: { flex: 0.5 },
  cellIndex: { flex: 0.5 },
  emptyMessage: { textAlign: 'center', color: 'lightgray', marginTop: 50 },
  exPic: { width: 60, height: 60, borderRadius: 20, marginRight: 10 },
});
