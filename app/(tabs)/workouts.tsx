import { View, Text, StyleSheet, Button, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { Ionicons } from "@expo/vector-icons";


export default function Tab() {

  const [workouts, setWorkouts] = useState<{id: string, name: string; exercises: string; volume: string; duration: string; date:Timestamp }[]>([]);
  const user = auth().currentUser;

  const lastSession = (date: Timestamp | null | undefined) => {
    if (!date) return "Last session: N/A";
  
    const now = Timestamp.now();
    const diff = now.seconds - date.seconds;
    const days = Math.floor(diff / 86400);

    if (days < 1) {
      const hours = Math.floor(diff / 3600);
      if(hours < 1) return `Last session: now`;
      return `Last session: ${hours} hours ago`;
    }
    else return `Last session: ${days} days ago`;
    
  };
  
  useEffect(() => {
    firestore().collection('users').doc(user?.uid).collection('workoutPlans').onSnapshot(documentSnapshot => {
      const workoutsList = documentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, 
          name: data.name, 
          volume: data.volume,
          duration: data.duration,
          date: data.createdAt,
          exercises: data.exercises ? data.exercises.map((exercise: { name: string }) => exercise.name).slice(0, 5).join(', ') : '' };
      });
      setWorkouts(workoutsList);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>

      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.workoutContainer} onPress={() => router.navigate({ pathname: '/viewWou', params: { id: item.id } })}>
              <View style={styles.workoutContainerBox}>
                <ThemedText style={styles.workoutName} type="subtitle">{item.name}</ThemedText>


                  <Ionicons name="ellipsis-horizontal" size={24} color="white" style={{position: 'absolute', right: 10, top: 10}} />

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.lastSession}>{lastSession(item.date)}</Text>
                  <Text style={styles.buttonStartPlan} onPress={() => {
                    router.push({ pathname: '/newWou', params: { selectedWorkout: item.id } });
                  }}>Start Workout</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View>
              <ThemedText style={styles.menuTitle} type="title">Workouts</ThemedText>
              

              <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
                <Text style={styles.buttonNew} onPress={() => {router.push("/smartPlan")}}>Smart Plan</Text>
                <Text style={styles.buttonNew} onPress={() => {router.push("/newWou")}}>New workout</Text>
              </View>
            </View>
          }
        />
      ) : (
        <View>
        <ThemedText style={styles.menuTitle} type="title">Workouts</ThemedText>

        <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
          <Text style={styles.buttonNew} onPress={() => {router.push("/smartPlan")}}>Smart Plan</Text>
          <Text style={styles.buttonNew} onPress={() => {router.push("/newWou")}}>New workout</Text>
        </View>

        <ThemedText style={{textAlign: 'center'}} type="subtitle">No workouts found</ThemedText>
      </View>
        
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
    marginVertical: 6,
    marginHorizontal: 8,
  },
  workoutContainerBox: {
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 6,
  },

  workoutName: {
    fontSize: 26,
    //paddingLeft: 8,
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
  buttonStartPlan: {
    color: "white",
    backgroundColor: "rebeccapurple",
    borderRadius: 8,
    padding: 6,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  lastSession: {
    color: 'lightgrey',
    fontSize: 16,
    paddingTop: 8,
  },
});
