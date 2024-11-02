import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function Tab() {

  const user = auth().currentUser;
  
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

      <ThemedText style={styles.menuTitle} type="title">Profile</ThemedText>

      <Image source={require('@/assets/images/icon.png')} style={styles.image} />

      <ThemedText style={styles.userName} type="default">{user?.displayName}</ThemedText>

      <View style={styles.containerData}>

        <View>
          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold'}} type="default">Weight</ThemedText>
          <ThemedText style={{ textAlign: 'center', fontSize: 20, color:'darkgrey', padding: 10}} type="default">73kg</ThemedText>
        </View>
        
        <View>
          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold'}} type="default">Height</ThemedText>
          <ThemedText style={{ textAlign: 'center', fontSize: 20, color:'darkgrey', padding: 10}} type="default">179cm</ThemedText>
        </View>

        <View>
          <ThemedText style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold'}} type="default">Workouts</ThemedText>
          <ThemedText style={{ textAlign: 'center', fontSize: 20, color:'darkgrey', padding: 10}} type="default">213</ThemedText>
        </View>
        
      </View>


      

      <Link style={styles.link} href="/settings">Settings</Link>
      <Button title="Logout" onPress={() => auth().signOut()} />


    
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  link: {
    color: 'blue',

  },
  menuTitle: {
    textAlign: 'center',
    padding: 20,
    fontSize: 50,
  },

  userName: {
    textAlign: 'center',
    padding: 20,
    fontSize: 30,
  },

  containerData: {
    flexDirection: 'row',
    //elements of this container will be spaced evenly
    justifyContent: 'space-evenly',
    padding: 20,
    
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignSelf: 'center',
  },

});
