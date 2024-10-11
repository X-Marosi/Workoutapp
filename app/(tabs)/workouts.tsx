import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function Tab() {
  return (
    <ScrollView style={{flex: 1}}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

        <ThemedText style={styles.menuTitle} type="title">Workouts</ThemedText>

        {/* Workouts List */}

        <View style={styles.workoutContainer}>
        <ThemedText style={styles.workoutName} type="title">wou_name</ThemedText>
          <View style={styles.workoutContainerBox}>
            <ThemedText type="subtitle">exercises placeholder,exercises placeholder,exercises placeholder</ThemedText>
            <ThemedText style={styles.button} type="title">Start Workout</ThemedText>
          </View>
        </View>

        <View style={styles.workoutContainer}>
        <ThemedText style={styles.workoutName} type="title">wou_name</ThemedText>
          <View style={styles.workoutContainerBox}>
            <ThemedText type="subtitle">exercises placeholder,exercises placeholder,exercises placeholder</ThemedText>
            <ThemedText style={styles.button} type="title">Start Workout</ThemedText>
          </View>
        </View>

        <View style={styles.workoutContainer}>
        <ThemedText style={styles.workoutName} type="title">wou_name</ThemedText>
          <View style={styles.workoutContainerBox}>
            <ThemedText type="subtitle">exercises placeholder,exercises placeholder,exercises placeholder</ThemedText>
            <ThemedText style={styles.button} type="title">Start Workout</ThemedText>
          </View>
        </View>


        {/* New Workout Button */}
        <Link style={styles.buttonNew} href="/emptyWou">New Workout</Link>


      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  menuTitle: {
    textAlign: 'center',
    padding: 20,
    paddingTop: 160,
    paddingBottom: 160,
    fontSize: 50,
  },

  button: {
    color: 'white',
    backgroundColor: 'cornflowerblue',
    borderRadius: 8,
    padding: 5,
    margin: 0,
    fontSize: 20,
    alignSelf: 'flex-end'
  },

  buttonNew: {
    color: 'white',
    backgroundColor: 'cornflowerblue',
    borderRadius: 8,
    padding: 5,
    margin: 10,
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },

  workoutContainer: {
    justifyContent: 'center',
    //border width and color for debugging
    //borderWidth: 1,
    //borderColor: 'red',

  
  },
  workoutContainerBox: {
    margin: 10,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },

  workoutName: {
    fontSize: 30,
    paddingLeft: 8,
  }
});
