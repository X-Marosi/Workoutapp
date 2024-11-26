import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';


export default function Tab() {

  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [workouts, setWorkouts] = useState('');

  useEffect(() => {
    const subscriber = firestore().collection('users').doc(user?.uid).onSnapshot(documentSnapshot => {
      setName(documentSnapshot.data()?.username);
      setWeight(documentSnapshot.data()?.weight);
      setHeight(documentSnapshot.data()?.height);
      setWorkouts(documentSnapshot.data()?.workouts);
    });
    return subscriber;
  });

  
  return (
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

        <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold'}} type="default">Charts</ThemedText>
        <Image source={require('@/assets/images/icon.png')} style={styles.image} />

        

        
        <Text style={styles.settings} onPress={() => {router.push("/settings")}}>Edit Profile</Text>
        <Text style={styles.logout} onPress={() => auth().signOut()}>Logout</Text>

    
      </LinearGradient>
    </ThemedView>
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
