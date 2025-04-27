import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { LineChart, ContributionGraph } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useUser } from '@/context/userContext';
import auth from '@react-native-firebase/auth';

export default function Tab() {

  //User Data from UserContext
  const { name, weight, weightRecords, height, workoutCount, workoutRecords, gender } = useUser()
  const screenWidth = Dimensions.get('window').width;

  const lineChartData = {
    labels: [],
    datasets: [
      {
        data: weightRecords.length > 15 ? weightRecords.slice(weightRecords.length - 15) : weightRecords,
        color: () => 'rebeccapurple',
        strokeWidth: 2,
      }
    ],
    legend: []
  };

  const workoutDays = workoutRecords.map(([date, value]) => {
    return { date: date, value };
  });

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

          {/* Page Title */}
          <ThemedText style={styles.menuTitle} type="title"> Profile </ThemedText>

          {/* User Name */}
          <ThemedText style={styles.userName} type="default"> {name} </ThemedText>

          {/* User Data */}
          <View style={styles.containerData}>

            <View>
              {/* Weight */}
              <ThemedText style={styles.infoTitle} type="default">Weight</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {weight} </ThemedText>
            </View>
            
            <View>
              {/* Height */}
              <ThemedText style={styles.infoTitle} type="default">Height</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {height} </ThemedText>
            </View>

            <View>
              {/* Workouts */}
              <ThemedText style={styles.infoTitle} type="default">Workouts</ThemedText>
              <ThemedText style={styles.infoData} type="default"> {workoutCount} </ThemedText>
            </View>
            
          </View>
          
          {/* Workout Calendar Graph */}
          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', paddingVertical: 10 }} type="default"> Workout Calendar </ThemedText>
          
          <ContributionGraph
            values={workoutDays}
            endDate={new Date()}
            numDays={93}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: 'black',
              color: (opacity = 1) => `rgba(102, 51, 153, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center'
            }}
            tooltipDataAttrs={({ value }) => ({ rx: 6, ry: 6, height: 18, width: 18, fill: value > 0 ? 'rebeccapurple' : '#1E1E1E' })}
          />

          {/* Weight Graph */}
          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', paddingVertical: 10 }} type="default">Bodyweight</ThemedText>
          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: 'black',
              color: (opacity = 1) => `rgba(102, 51, 153, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: 'transparent'
              }
            }}
            //bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center'
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
  },
  body: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
