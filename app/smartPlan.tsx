import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/context/userContext';
import auth from '@react-native-firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {

    const { name, weight, weightRecords, height, workoutCount, workoutRecords, gender } = useUser()

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
                <ThemedText style={styles.menuTitle} type="title">Smart Plan</ThemedText>
                <ThemedText style={{ fontWeight: '400', padding: 20, alignSelf: 'center'}} type="subtitle">Create your workout plan</ThemedText>
            </LinearGradient>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    menuTitle: {
        textAlign: 'center',
        marginTop: 100,
        padding: 20,
        fontSize: 50,
      },
});