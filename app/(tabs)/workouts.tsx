import { View, Text, StyleSheet, Button, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function Tab() {

  const [workouts, setWorkouts] = useState<{id: string, name: string; exercises: string; volume: string; duration: string }[]>([]);
  const user = auth().currentUser;
  
  
  useEffect(() => {
    firestore().collection('users').doc(user?.uid).collection('workoutPlans').onSnapshot(documentSnapshot => {
      const workoutsList = documentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, 
          name: data.name, 
          volume: data.volume,
          duration: data.duration,
          exercises: data.exercises ? data.exercises.map((exercise: { name: string }) => exercise.name).slice(0, 5).join(', ') : '' };
      });
      setWorkouts(workoutsList);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
        <ThemedText style={styles.menuTitle} type="title">
          Workouts
        </ThemedText>

        <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
          <Text style={styles.buttonNew} onPress={() => {}}>Create Plan</Text>
          <Text style={styles.buttonNew} onPress={() => {router.push("/newWou")}}>New workout</Text>
        </View>


      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.workoutContainer} onPress={() => router.navigate({ pathname: '/viewWou', params: { id: item.id } })}>
              <ThemedText style={styles.workoutName} type="title">{item.name}</ThemedText>
              <View style={styles.workoutContainerBox}>
                <Text style={styles.exercises}>{item.exercises}</Text>
                <View style={{flexDirection: "row"}}>
                  <Text style={styles.wouInfo}>Volume: {item.volume}kg</Text>
                  <Text style={styles.wouInfo}>Duration: {item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <ThemedText style={{textAlign: 'center'}} type="subtitle">No workouts found</ThemedText>
      )}

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  menuTitle: {
    textAlign: 'center',
    marginTop: 100,
    padding: 20,
    fontSize: 50,
  },

  button: {
    color: "white",
    backgroundColor: "rebeccapurple",
    borderRadius: 8,
    padding: 5,
    margin: 0,
    fontSize: 20,
    alignSelf: "flex-end",
  },

  buttonNew: {
    color: "white",
    backgroundColor: "rebeccapurple",
    borderRadius: 8,
    padding: 6,
    margin: 30,
    fontSize: 22,
    alignSelf: "center",
    fontWeight: "bold",
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
