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

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
    if (!username.trim()) {
        alert("Username is required");
        return;
    }
    setLoading(true);
    try {
        const user = await auth().createUserWithEmailAndPassword(email, password);
        //add username to user
        await user.user?.updateProfile({
            displayName: username,
        });
        //console.log(user);
        await firestore().collection('users').doc(user.user?.uid).set({
            username: username,
            email: email,
            createdAt: firestore.FieldValue.serverTimestamp()
        });
        router.replace("/setup");
    } catch (error) {
        const err = error as FirebaseError;
        console.log(err.code);
        console.log(err.message);
        alert("Registration Failed: " + err.message);
    }
    setLoading(false);
};
  

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

            <ThemedText style={styles.menuTitle} type="title">Welcome</ThemedText>

            <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            />

            <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            />

            <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            />


            {loading ? (<ActivityIndicator size="large" color="#0a7ea4" />) : (
                <>
                <Button title="Register" onPress={handleRegister} />
                </>
            )}

            <Text style={styles.link} onPress={() => router.replace("/")}>Login here</Text>


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
