import { View, Text, StyleSheet, Button, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

export default function Tab() {
  const [page, setPage] = useState<'none' | 'weight' | 'name' | 'height' | 'age'>('none');
  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const subscriber = firestore().collection('users').doc(user?.uid).onSnapshot(documentSnapshot => {
      setName(documentSnapshot.data()?.username);
      setWeight(documentSnapshot.data()?.weight[documentSnapshot.data()?.weight.length - 1]);
      setHeight(documentSnapshot.data()?.height);
      setAge(documentSnapshot.data()?.age);
    });
    return subscriber;
  }, []);

  const addWeight = async (current: string) => {

      const userDoc = firestore().collection('users').doc(user?.uid);
      const userSnapshot = await userDoc.get();
      const currentWeights = userSnapshot.data()?.weight || []; // Default to empty array if undefined
      const updatedWeights = [...currentWeights, parseInt(current)];
      await userDoc.update({ weight: updatedWeights });
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

        <ThemedText style={styles.menuTitle} type="title">Settings</ThemedText>

        {page === 'name' ? (
          <View style={styles.settingOption}>
            <Text style={styles.button} onPress={()=>{setPage('none')}}>Back</Text>

            <TextInput placeholder={name} placeholderTextColor='darkgrey' keyboardType='numeric' style={styles.input} onChangeText={setCurrent}/>

            <Text style={styles.button} onPress={()=>{setPage('none'); if (current != '') { firestore().collection('users').doc(user?.uid).update({username: current}) }}}>Save</Text>
          </View>
        ) : (
        <View style={styles.settingOption}>
          <Text style={styles.settingName}>Name</Text>
          <Text style={styles.settingText}>{name}</Text>
          <Text style={styles.button} onPress={()=>{setCurrent(''); setPage('name')}}>Change</Text>
        </View>
        )}

        {page === 'weight' ? (
          <View style={styles.settingOption}>
            <Text style={styles.button} onPress={()=>{setPage('none')}}>Back</Text>

            <TextInput placeholder={weight.toString()} placeholderTextColor='darkgrey' keyboardType='numeric' style={styles.input} onChangeText={setCurrent}/>

            <Text style={styles.button} onPress={()=> {
                setPage('none'); 
                if (current != '') { addWeight(current);} 
              }}>Save
            </Text>
          </View>
        ) : (
        <View style={styles.settingOption}>
          <Text style={styles.settingName}>Weight</Text>
          <Text style={styles.settingText}>{weight}</Text>
          <Text style={styles.button} onPress={()=>{setCurrent(''); setPage('weight')}}>Change</Text>
        </View>
        )}

        {page === 'height' ? (
          <View style={styles.settingOption}>
            <Text style={styles.button} onPress={()=>{setPage('none')}}>Back</Text>

            <TextInput placeholder={height} placeholderTextColor='darkgrey' keyboardType='numeric' style={styles.input} onChangeText={setCurrent}/>

            <Text style={styles.button} onPress={()=>{setPage('none'); if (current != '') { firestore().collection('users').doc(user?.uid).update({height: current}) }}}>Save</Text>
          </View>
        ) : (
        <View style={styles.settingOption}>
          <Text style={styles.settingName}>Height</Text>
          <Text style={styles.settingText}>{height}</Text>
          <Text style={styles.button} onPress={()=>{setCurrent(''); setPage('height')}}>Change</Text>
        </View>
        )}

        {page === 'age' ? (
          <View style={styles.settingOption}>
            <Text style={styles.button} onPress={()=>{setPage('none')}}>Back</Text>

            <TextInput placeholder={age} placeholderTextColor='darkgrey' keyboardType='numeric' style={styles.input} onChangeText={setCurrent}/>

            <Text style={styles.button} onPress={()=>{setPage('none'); if (current != '') { firestore().collection('users').doc(user?.uid).update({age: current}) }}}>Save</Text>
          </View>
        ) : (
        <View style={styles.settingOption}>
          <Text style={styles.settingName}>Age</Text>
          <Text style={styles.settingText}>{age}</Text>
          <Text style={styles.button} onPress={()=>{setCurrent(''); setPage('age')}}>Change</Text>
        </View>
        )}

      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', },
  menuTitle: {
    textAlign: 'center',
    marginVertical: 100,
    padding: 20,
    fontSize: 50,
  },
  settingOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 20},
  settingText: { alignSelf: 'center', fontSize: 25, color: 'white', fontWeight: 'bold', textAlign: 'center', width: 100 },
  settingName: { fontSize: 24, color: 'darkgrey', fontWeight: 'bold', width: 100 },
  settingTitle: { fontSize: 20, color: 'white', textAlign: 'center', padding: 20 },
  button: { textAlign: 'center', color: 'rebeccapurple', fontSize: 18, padding: 10, width: 100  },
  input: { textAlign: 'center', fontSize: 24, color: 'white', fontWeight: 'bold', backgroundColor: '#222', borderRadius: 8, width: 100},
});

