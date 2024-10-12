import { View, Text, StyleSheet, Button, FlatList, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { fetchExercises } from "@/api/exerciseDB";
import { exerciseDump } from "@/constants/exercise";

export default function Tab() {
  const [exercises, setExercises] = useState(exerciseDump);

  //console.log(exercises);
  //console.log(exerciseDump);

  useEffect(() => {
    //fetchExercises();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <View style={styles.containerBox}>
              <Image
                style={{ width: 50, height: 50, borderRadius: 8 }}
                source={{ uri: item.gifUrl }}
              />
              <View style={{ marginLeft: 10 }}>
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText>Muscle: {item.bodyPart}</ThemedText>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  menuTitle: {
    textAlign: "center",
    padding: 20,
    fontSize: 50,
  },
  containerBox: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
  },
});
