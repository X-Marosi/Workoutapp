import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

export default function Tab() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

      <ThemedText style={styles.menuTitle} type="title">Home</ThemedText>

      <Image source={require('@/assets/images/icon.png')} style={styles.image} />


    
      </LinearGradient>
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

});
