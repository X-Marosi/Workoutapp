import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/util';
import { router } from 'expo-router';


export default function Tab() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        alert("Missing required fields");
        setLoading(false);
        return;
      }
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
            placeholderTextColor={'grey'}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="EMAIL"
            keyboardType="email-address"
          />

          <TextInput
            placeholderTextColor={'grey'}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="PASSWORD"
            secureTextEntry
          />
          
          {loading ? (<ActivityIndicator size="large" color="rebeccapurple" />) : (
              <View>
                <Text style={styles.buttonNew} onPress={handleLogin}>Login</Text>
              </View>
            )}

          <Text style={styles.link} onPress={() => router.push("/register")}>Don't have an account? Register here</Text>

        </LinearGradient>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center'
  },
  menuTitle: { 
    textAlign: 'center',
    padding: 20,
    fontSize: 50
  },
  image: { 
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignSelf: 'center'
  },
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
  link: { 
    textAlign: 'center',
    color: 'rebeccapurple',
    padding: 10,
    fontSize: 16
  },
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
