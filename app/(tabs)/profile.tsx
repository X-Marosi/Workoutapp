import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function Tab() {

  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [weight, setWeight] = useState();
  const [weigthRecords, setWeightRecords] = useState<number[]>([]);
  const [height, setHeight] = useState('');
  const [workouts, setWorkouts] = useState('');

  useEffect(() => {
    const subscriber = firestore().collection('users').doc(user?.uid).onSnapshot(documentSnapshot => {
      setName(documentSnapshot.data()?.username);
      setWeight(documentSnapshot.data()?.weight[documentSnapshot.data()?.weight.length - 1]);
      setWeightRecords(documentSnapshot.data()?.weight.map((weight: number) => weight));
      console.log(weigthRecords);
      setHeight(documentSnapshot.data()?.height);
      setWorkouts(documentSnapshot.data()?.workouts);
    });
    return subscriber;
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: weigthRecords,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Weight Over Time']
  };

  const barChartData = {
    labels: ['Push-ups', 'Squats', 'Running', 'Plank'],
    datasets: [
      {
        data: [20, 45, 28, 80]
      }
    ]
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
          <ThemedText style={styles.menuTitle} type="title">
            Profile
          </ThemedText>

          <ThemedText style={styles.userName} type="default"> {name} </ThemedText>

          <View style={styles.containerData}>

            <View>
              <ThemedText style={styles.infoTitle} type="default">Weight</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {weight} </ThemedText>
            </View>
            
            <View>
              <ThemedText style={styles.infoTitle} type="default">Height</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {height} </ThemedText>
            </View>

            <View>
              <ThemedText style={styles.infoTitle} type="default">Workouts</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {workouts} </ThemedText>
            </View>
            
          </View>

          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold' }} type="default">Charts</ThemedText>

          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: 'black',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center'
            }}
          />
          
          <BarChart
            data={{
              labels: ['Push-ups', 'Squats', 'Running', 'Plank'],
              datasets: [
                {
                  data: [20, 45, 28, 80],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" reps"
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: 'black',
              decimalPlaces: 0, // Ensure no floating point issues
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center',
            }}
          />


          <Text style={styles.settings} onPress={() => { router.push("/settings") }}>Edit Profile</Text>
          <Text style={styles.logout} onPress={() => auth().signOut()}>Logout</Text>
        </LinearGradient>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: 'white',
  },

  settings: {
    textAlign: 'center',
    fontSize: 20,
    color: 'rebeccapurple',
    padding: 10,
  },

  logout: {
    position: 'absolute',
    top: 40,
    right: 20,
    textAlign: 'center',
    fontSize: 20,
    color: 'rebeccapurple',
  },
  menuTitle: {
    textAlign: 'center',
    marginTop: 100,
    padding: 20,
    fontSize: 50,
  },

  userName: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'rebeccapurple',
    padding: 20,
    fontSize: 40,
  },

  containerData: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    paddingHorizontal: 0,
  },

  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    alignSelf: 'center',
    margin: 20,
  },

  infoTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#b1a7a6',
  },

  infoData: {
    textAlign: 'center',
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold',
  }

});
