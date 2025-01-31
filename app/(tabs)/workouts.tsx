import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider, Provider } from 'react-native-paper';



export default function Tab() {
  const [workouts, setWorkouts] = useState<{ id: string, name: string, exercises: string, volume: string, duration: string, date: Timestamp }[]>([]);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null); // Track which menu is open
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('workoutPlans')
      .onSnapshot(documentSnapshot => {
        const workoutsList = documentSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            volume: data.volume,
            duration: data.duration,
            date: data.createdAt,
            exercises: data.exercises ? data.exercises.map((exercise: { name: string }) => exercise.name).slice(0, 5).join(', ') : ''
          };
        });
        setWorkouts(workoutsList);
      });

    return () => unsubscribe();
  }, [user]);

  // Function to delete a workout
  const deleteWorkout = async (workoutId: string) => {
    if (!user) return;
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('workoutPlans')
        .doc(workoutId)
        .delete();
      console.log("Workout deleted successfully");
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

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

  return (
    <Provider>
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.navigate({ pathname: '/viewWou', params: { id: item.id } })}>
              <View style={styles.workoutContainer}>
                <View style={styles.workoutContainerBox}>
                  <ThemedText style={styles.workoutName} type="subtitle">{item.name}</ThemedText>

                  <View style={styles.menuWrapper}>
                    <Menu
                      visible={visibleMenuId === item.id}
                      onDismiss={() => setVisibleMenuId(null)}
                      anchor={
                        <TouchableOpacity onPress={() => setVisibleMenuId(item.id)}>
                          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                        </TouchableOpacity>
                      }
                      contentStyle={styles.menuContent} // Custom styles for menu items
                      style={styles.menuContainer} // Custom styles for positioning
                    >
                      <Menu.Item titleStyle={styles.menuItemText} title="Delete" onPress={() => deleteWorkout(item.id)} />
                    </Menu>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.lastSession}>{lastSession(item.date)}</Text>
                    <Text style={styles.buttonStartPlan} onPress={() => router.push({ pathname: '/newWou', params: { selectedWorkout: item.id } })}>
                      Start Workout
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View>
              <ThemedText style={styles.menuTitle} type="title">Workouts</ThemedText>
              <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
                <Text style={styles.buttonNew} onPress={() => router.push("/smartPlan")}>Smart Plan</Text>
                <Text style={styles.buttonNew} onPress={() => router.push("/newWou")}>New workout</Text>
              </View>
            </View>
          }
        />
      </LinearGradient>
    </View>
  </Provider>
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
    textTransform: 'capitalize',
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
    menuWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  menuContainer: {
    backgroundColor: "#222", // Dark background
    borderRadius: 8, // Rounded corners
    marginTop: 20, // Add some space above the menu
    width: 85,


  },

  menuContent: {
    backgroundColor: "#111", // Custom background color
    borderRadius: 10, // Make it rounded
    // make the space above and below the text smaller
    paddingVertical: 0,


  },

  menuItemText: {
    fontSize: 18,
    color: "white", // White text
    fontWeight: "bold",
  },
});
