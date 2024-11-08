import { View, Text, StyleSheet, Button, Image, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/util';
import { router } from 'expo-router';


export default function Tab() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      console.log(user);
    } catch (error) {
      const err = error as FirebaseError;
      console.log(err.code);
      console.log(err.message);
      alert("Login Failed"+err.message);
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
              <Button title="Login" onPress={handleLogin} />
              </>
            )}

          <Text style={styles.link} onPress={() => router.push("/register")}>Don't have an account? Register here</Text>


        </LinearGradient>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  menuTitle: { textAlign: 'center', padding: 20, fontSize: 50 },
  image: { width: 150, height: 150, borderRadius: 150 / 2, alignSelf: 'center' },
  input: { backgroundColor: 'white', padding: 10, margin: 10 },
  link: { textAlign: 'center', color: '#0a7ea4', padding: 10 },
});
