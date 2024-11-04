import { View, Text, StyleSheet, Button, FlatList, Image, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchExercises } from "@/api/exerciseDB";
import { router } from "expo-router";


export default function Tab() {
  const [searchQuery, setSearchQuery] = useState("");

  //console.log(exercises);

//get data from fetchExercises use it for exercises
  const [exercises, setExercises] = useState<{ id: string; name: string; target: string; equipment: string; gifUrl: string }[]>([]);
  useEffect(() => {
    fetchExercises().then((data) => {
      setExercises(data);
    });
  }, []);
  

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) /*||
      exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())*/
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={{ padding: 16, flex: 1 }}>

        <TextInput style={styles.searchBar} placeholder="Search exercises" value={searchQuery} onChangeText={setSearchQuery}/>

        <FlatList data={filteredExercises} renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => {
              //console.log(item);
              // Navigate back to the previous screen and pass the selected exercise
              router.navigate({ pathname: '/blankWou', params: { selectedExercise: JSON.stringify(item) } });
            }}>
            <View style={styles.containerBox}>

              <View style={styles.exGifContainer}>
                <Image style={styles.exGif} source={{ uri: item.gifUrl }}/>
              </View>
              
              <View style={{ marginLeft: 10 }}>
                <ThemedText style={styles.capitalize} type="subtitle">{item.name}</ThemedText>
                <ThemedText style={styles.capitalize}>{item.target} | {item.equipment}</ThemedText>
              </View>
            </View>
            </TouchableOpacity>
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
  exGifContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden', // This makes sure the content is clipped to the border radius
  },
  exGif: {
    width: '100%',
    height: '100%',
  },
  capitalize: {
    textTransform: "capitalize",
  },
});
