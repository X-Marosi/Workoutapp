import { View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function Tab() {
  const [workouts, setWorkouts] = useState<{id: string, name: string; exercises: string }[]>([]);


  useEffect(() => {
    firestore().collection('workouts').onSnapshot(documentSnapshot => {
      const workoutsList = documentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {id: doc.id, name: data.name, exercises: data.exercises.map((exercise: { name: string }) => exercise.name).join(', ')};
      });
      setWorkouts(workoutsList);
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

      <ThemedText style={styles.menuTitle} type="title">Home</ThemedText>

      {/*<Image source={require('@/assets/images/icon.png')} style={styles.image} />*/}

      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.workoutContainer} onPress={() => router.navigate({ pathname: '/viewWou', params: { id: item.id } })}>
            <ThemedText style={styles.workoutName} type="title">{item.name}</ThemedText>
            <View style={styles.workoutContainerBox}>
              <ThemedText type="subtitle">{item.exercises}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />

    
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  menuTitle: {
    textAlign: "center",
    padding: 20,
    marginTop: 150,
    paddingBottom: 150,
    fontSize: 50,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignSelf: 'center',
  },
  workoutContainer: {
    justifyContent: "center",
    //border width and color for debugging
    //borderWidth: 1,
    //borderColor: 'red',
  },
  workoutContainerBox: {
    margin: 10,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
  },

  workoutName: {
    fontSize: 30,
    paddingLeft: 8,
  },

});
