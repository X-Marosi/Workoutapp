import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { fetchExercises } from "@/api/exerciseDB";
import { exerciseListAll } from "@/constants/exercise";

export default function Tab() {
  const [exercises, setExercises] = useState(exerciseListAll);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    //fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#1E1E1E", "black"]}
        style={{ padding: 16, flex: 1 }}
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search exercises"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredExercises}
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
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "white",
  },
  containerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
});
