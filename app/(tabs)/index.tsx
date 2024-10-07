import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';


export default function Tab() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

        <ThemedText style={styles.menuTitle} type="title">Home</ThemedText>

        <Image
          style={styles.image}
          source="../assets/images/icon.png"
          placeholder="../assets/images/icon.png"
          contentFit="cover"
          transition={1000}
      />





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
