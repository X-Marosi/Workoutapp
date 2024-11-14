import { StyleSheet, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

export default function Tab() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#1E1E1E', 'black']} style={styles.container}>

        <Image source={require('@/assets/images/icon.png')} style={styles.image} />

      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  image: { width: 150, height: 150, borderRadius: 150 / 2, alignSelf: 'center' },

});
