import { View, Text, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  }
});
