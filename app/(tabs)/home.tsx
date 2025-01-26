import { View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore, { Timestamp } from '@react-native-firebase/firestore';

export default function Tab() {
  const [workouts, setWorkouts] = useState<{ id: string, name: string; exercises: string; volume: string; duration: string, date: Timestamp }[]>([]);
  const user = auth().currentUser;

  const lastSession = (date: Timestamp | null | undefined) => {
    if (!date) {
      return "Last session: N/A";
    }
    const now = Timestamp.now();
    const diff = now.seconds - date.seconds;
    const days = Math.floor(diff / 86400);

    if (days < 1) {
      const hours = Math.floor(diff / 3600);
      if(hours < 1) {
        return `now`;
      }
      return `${hours} hours ago`;
    }
    else {
      return `${days} days ago`;
    }
  };
  

  useEffect(() => {
    firestore().collection('users').doc(user?.uid).collection('workouts').onSnapshot(documentSnapshot => {
      const workoutsList = documentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, 
          name: data.name, 
          volume: data.volume,
          duration: data.duration,
          date: data.createdAt,
          exercises: data.exercises ? data.exercises.map((exercise: { name: string, sets: Array<number> }) => exercise.sets.length + 'x  ' + exercise.name)/*.slice(0, 5)*/.join('\n') : ''
        };
      });
      workoutsList.sort((a, b) => b.date.seconds - a.date.seconds);
      workoutsList.splice(40);
      setWorkouts(workoutsList);
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.workoutContainer} onPress={() => router.navigate({ pathname: '/viewWou', params: { id: item.id } })}>
              <View style={styles.workoutContainerBox}>
                <ThemedText style={styles.workoutName} type="title">{item.name}</ThemedText>
                <Text style={styles.exercises}>{item.exercises}</Text>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                  <Text style={styles.wouInfo}>Duration: {item.duration}</Text>
                  <Text style={styles.wouInfo}>{lastSession(item.date)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View>
              <ThemedText style={styles.menuTitle} type="title">Home</ThemedText>
              <ThemedText style={{ fontWeight: '400', padding: 20, alignSelf: 'center'}} type="subtitle">Workout History</ThemedText>
            </View>
          }
        />
      ) : (
        <View>
          <ThemedText style={styles.menuTitle} type="title">Home</ThemedText>
          <ThemedText style={{ fontWeight: '400', padding: 20, alignSelf: 'center'}} type="subtitle">Workout History</ThemedText>
          <ThemedText style={{textAlign: 'center'}} type="subtitle">No workouts found</ThemedText>
        </View>
      )}


    
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
    textAlign: 'center',
    marginTop: 100,
    padding: 20,
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
    marginVertical: 6,
    marginHorizontal: 8,
  },
  workoutContainerBox: {
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 6,
  },

  workoutName: {
    fontSize: 24,
    textTransform: 'capitalize',
  },

  exercises: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
  },

  wouInfo: {
    fontSize: 15,
    color: 'white',
    paddingTop: 10,
    paddingRight: 10,
  },

});
