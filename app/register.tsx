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
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');

  // Registration Handler
  const handleRegister = async () => {
    if (!username.trim()) {
      alert("Username is required");
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
        weight: 0,
        height: 0,
        age: 0,
        workouts: 0,
      });
      //Create a collection for the user's workouts
      await firestore().collection('users').doc(user.user?.uid).collection('workouts').doc().set({
        createdAt: firestore.FieldValue.serverTimestamp()
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
    if (!weight.trim() || !height.trim() || !age.trim()) {
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
              <ThemedText style={styles.menuTitle} type="title">Welcome</ThemedText>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username"/>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address"/>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry/>
              
              {loading ? (
                <ActivityIndicator size="large" color="#0a7ea4" />
              ) : (
                <Button title="Register" onPress={handleRegister} />
              )}
              
              <Text style={styles.link} onPress={() => router.replace("/")}>Login here</Text>
            </>
          ) : ( // Setup Page
            <>
              <ThemedText style={styles.menuTitle} type="title">Setting up your account</ThemedText>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Weight" keyboardType="numeric"/>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} placeholder="Height" keyboardType="numeric"/>
              <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric"/>

              {loading ? (
                <ActivityIndicator size="large" color="#0a7ea4" />
              ) : (
                <Button title="Continue" onPress={handleSetup} />
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
  input: { backgroundColor: 'white', padding: 10, margin: 10 },
  link: { textAlign: 'center', color: '#0a7ea4', padding: 10},
});
