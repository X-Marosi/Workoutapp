import { View, Text, StyleSheet, Button, Image, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/util';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';


export default function Tab() {

    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
  

    const handleSetup = async () => {
        if (!weight.trim() || !height.trim() || !age.trim()) {
            alert("Missing required fields");
            return;
        }
        setLoading(true);
        try {
            await firestore().collection('users').doc(auth().currentUser?.uid).update({
                weight: weight,
                height: height,
                age: age,
                workouts: 0,
            });
        } catch (error) {
            const err = error as FirebaseError;
            console.log(err.code);
            console.log(err.message);
            alert("Registration Failed: " + err.message);
        }
        finally {
            router.replace("/(tabs)/home");
        }
        setLoading(false);
};
  

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

            <ThemedText style={styles.menuTitle} type="title">Setting up your account</ThemedText>

            <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight"
            keyboardType="numeric"
            />

            <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Height"
            keyboardType="numeric"
            />

            <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="numeric"
            />


            {loading ? (<ActivityIndicator size="large" color="#0a7ea4" />) : (
                <>
                <Button title="Continue" onPress={handleSetup} />
                </>
            )}


        </LinearGradient>
      </KeyboardAvoidingView>
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
    padding: 20,
    fontSize: 50,
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
  },
  link: {
    textAlign: 'center',
    color: '#0a7ea4',
    padding: 10,
  },
});
