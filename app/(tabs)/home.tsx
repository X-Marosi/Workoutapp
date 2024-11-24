import { View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function Tab() {
  const [workouts, setWorkouts] = useState<{id: string, name: string; exercises: string; volume: string; duration: string }[]>([]);


  useEffect(() => {
    firestore().collection('workouts').onSnapshot(documentSnapshot => {
      const workoutsList = documentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, 
          name: data.name, 
          volume: data.volume,
          duration: data.duration,
          exercises: data.exercises.map((exercise: { name: string }) => exercise.name).slice(0, 5).join(', ') };
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
              <Text style={styles.exercises}>{item.exercises}</Text>
              <View style={{flexDirection: "row"}}>
                <Text style={styles.wouInfo}>Volume: {item.volume}</Text>
                <Text style={styles.wouInfo}>Duration: {item.duration}</Text>
              </View>
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
    textTransform: 'capitalize',
  },

  exercises: {
    fontSize: 20,
    color: 'white',
    textTransform: 'capitalize',
  },

  wouInfo: {
    fontSize: 15,
    color: 'white',
    paddingRight: 10,
  },

});
