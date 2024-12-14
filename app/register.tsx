import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/util';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';

export default function Tab() {
  const [page, setPage] = useState<'register' | 'setup'>('register');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weight, setWeight] = useState<number[]>([]);
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');

  // Registration Handler
  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("Missing required field");
      return;
    }
    setLoading(true);
    try {
      const user = await auth().createUserWithEmailAndPassword(email, password);
      // Set the user's display name
      await user.user?.updateProfile({
        displayName: username,
      });
      // Create user document in Firestore
      await firestore().collection('users').doc(user.user?.uid).set({
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        weight,
        height: 0,
        age: 0,
        workouts: 0,
      });

      // Navigate to setup page
      setPage('setup');
    } catch (error) {
      const err = error as FirebaseError;
      alert("Registration Failed: " + err.message);
      console.error(err.code, err.message);
    }
    setLoading(false);
  };

  // Setup Handler
  const handleSetup = async () => {
    if (!weight || !height.trim() || !age.trim()) {
      alert("Missing required fields");
      return;
    }
    setLoading(true);
    try {
      await firestore().collection('users').doc(auth().currentUser?.uid).update({
        weight,
        height,
        age,
      });
      await firestore().collection('users').doc(auth().currentUser?.uid).collection('records').doc().set({ weight: weight});
      router.replace("/(tabs)/home");
    } catch (error) {
      const err = error as FirebaseError;
      alert("Setup Failed: " + err.message);
      console.error(err.code, err.message);
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>
          {page === 'register' ? ( // Register Page
            <>
              <ThemedText style={styles.menuTitle} type="title">Get Started</ThemedText>
              <TextInput style={styles.input} placeholderTextColor={'grey'} value={username} onChangeText={setUsername} placeholder="USERNAME"/>
              <TextInput style={styles.input} placeholderTextColor={'grey'} value={email} onChangeText={setEmail} placeholder="EMAIL" keyboardType="email-address"/>
              <TextInput style={styles.input} placeholderTextColor={'grey'} value={password} onChangeText={setPassword} placeholder="PASSWORD" secureTextEntry/>
              
              {loading ? (
                <ActivityIndicator size="large" color="rebeccapurple" />
              ) : (
                <Text style={styles.buttonNew} onPress={handleRegister}>Register</Text>
              )}
              
              <Text style={styles.link} onPress={() => router.replace("/login")}>Login here</Text>
            </>
          ) : ( // Setup Page
            <>
                <ThemedText style={styles.menuTitle} type="title">Setting up your account</ThemedText>
                <TextInput style={styles.input} placeholderTextColor={'grey'} value={weight[0]?.toString()} onChangeText={(text) => setWeight([parseFloat(text)])} placeholder="WEIGHT" keyboardType="numeric"/>
                <TextInput style={styles.input} placeholderTextColor={'grey'} value={height} onChangeText={setHeight} placeholder="HEIGHT" keyboardType="numeric"/>
                <TextInput style={styles.input} placeholderTextColor={'grey'} value={age} onChangeText={setAge} placeholder="AGE" keyboardType="numeric"/>

                {loading ? (
                <ActivityIndicator size="large" color="rebeccapurple" />
                ) : (
                <Text style={styles.buttonNew} onPress={handleSetup}>Continue</Text>
              )}
            </>
          )}
        </LinearGradient>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  menuTitle: { textAlign: 'center', padding: 20, fontSize: 50 },
  input: { 
    color: 'white',
    padding: 10,
    margin: 10,
    alignSelf: 'center',
    fontSize: 22,
    backgroundColor: '#222',
    borderRadius: 4,
    width: '80%',
  },
  link: { textAlign: 'center', color: 'rebeccapurple', padding: 10, fontSize: 16 },
  buttonNew: {
    color: "white",
    backgroundColor: "rebeccapurple",
    borderRadius: 8,
    padding: 6,
    paddingHorizontal: 20,
    margin: 10,
    fontSize: 22,
    alignSelf: "center",
    fontWeight: "bold",
  },
});
