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
        const unsubscribe = firestore().collection('users').doc(user?.uid).collection('workouts').onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                const fetchedData = documentSnapshot.data();
                if (fetchedData) {
                    setData(fetchedData.exercises || []);
                    setWorkoutName(fetchedData.name || '');
                    setVolume(fetchedData.volume || '');
                    setDuration(fetchedData.duration || '00:00:00');
                }
            });
        });

        return () => unsubscribe(); // Cleanup the Firestore listener on unmount
    }
    }, [workoutId]);

    const renderExercise = ({ item }: { item: { id: string; name: string; sets: { weight: number; reps: number }[] } }) => (
    <View style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
        <ThemedText style={styles.exerciseTitle}>{item.name}</ThemedText>
        </View>

        <View style={styles.setContainer}>
        <View style={styles.setRow}>
            <Text style={[styles.setHeader, styles.headerIndex]}>Set</Text>
            <Text style={styles.setHeader}>Weight (kg)</Text>
            <Text style={styles.setHeader}>Reps</Text>
        </View>
        {item.sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
            <Text style={[styles.setCell, styles.cellIndex]}>{index + 1}</Text>
            <Text style={styles.setCell}>{set.weight}</Text>
            <Text style={styles.setCell}>{set.reps}</Text>
            </View>
        ))}
        </View>
    </View>
    );

    return (
    <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
        <ThemedText style={styles.menuTitle} type="title">{workoutName}</ThemedText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={{ color: 'white' }}>Volume: {volume}</Text>
            <Text style={{ color: 'white' }}>Duration: {duration}</Text>
        </View>

        <FlatList
        data={data}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
            <Text style={styles.emptyMessage}>No exercises found in this workout.</Text>
        }
        />
    </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menuTitle: { textAlign: 'center', padding: 20, paddingTop: 30, fontSize: 30, color: 'white' },
  exerciseContainer: { marginBottom: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#2A2A2A', borderRadius: 10 },
  exerciseHeader: { marginBottom: 10 },
  exerciseTitle: { fontSize: 22, color: 'white', fontWeight: 'bold', textTransform: 'capitalize' },
  setContainer: { marginTop: 10 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  setHeader: { flex: 1, fontWeight: 'bold', color: 'lightgray', textAlign: 'center' },
  setCell: { flex: 1, color: 'white', textAlign: 'center' },
  headerIndex: { flex: 0.5 },
  cellIndex: { flex: 0.5 },
  emptyMessage: { textAlign: 'center', color: 'lightgray', marginTop: 50 },
});
