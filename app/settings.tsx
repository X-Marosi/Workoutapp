import { View, Text, StyleSheet, Button, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

export default function Tab() {
  const [page, setPage] = useState<'settings' | 'change'>('settings');
  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [current, setCurrent] = useState('');

  const changeData = (data: string) => {
    setCurrent(data);
    setPage('change');
  }

  useEffect(() => {
    const subscriber = firestore().collection('users').doc(user?.uid).onSnapshot(documentSnapshot => {
      setName(documentSnapshot.data()?.username);
      setWeight(documentSnapshot.data()?.weight);
      setHeight(documentSnapshot.data()?.height);
      setAge(documentSnapshot.data()?.age);
    });
    return subscriber;
  }, []);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

        {page === 'settings' ? (
          <View>
            <ThemedText style={styles.menuTitle} type="title">Settings</ThemedText>

            <Text style={styles.settingText}>Name</Text>
            <View style={styles.settingOption}>
              <Text style={styles.settingText}>{name}</Text>
              <Text style={styles.link} onPress={()=>{changeData(name)}}>Change</Text>
            </View>

            <Text style={styles.settingText}>Weight</Text>
            <View style={styles.settingOption}>
              <Text style={styles.settingText}>{weight}kg</Text>
              <Text style={styles.link} onPress={()=>{}}>Change</Text>
            </View>

            <Text style={styles.settingText}>Height</Text>
            <View style={styles.settingOption}>
              <Text style={styles.settingText}>{height}cm</Text>
              <Text style={styles.link} onPress={()=>{}}>Change</Text>
            </View>

            <Text style={styles.settingText}>Age</Text>
            <View style={styles.settingOption}>
              <Text style={styles.settingText}>{age}</Text>
              <Text style={styles.link} onPress={()=>{}}>Change</Text>
            </View>

          </View>
        ) : (
          <View>
            <TextInput placeholder={current}  placeholderTextColor='white' style={styles.input}/>
          </View>
        )}

      
     

      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', },
  menuTitle: { textAlign: 'center', padding: 20, fontSize: 50, },
  settingOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 20},
  settingText: { color: 'white' },
  settingTitle: { fontSize: 20, color: 'white', textAlign: 'center', padding: 20 },
  link: { textAlign: 'center', color: '#0a7ea4'},
  input: { textAlign: 'center', padding: 20, fontSize: 60, color: 'white', fontWeight: 'bold' },
});

