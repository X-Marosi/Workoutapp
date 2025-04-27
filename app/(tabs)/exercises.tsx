import { View, StyleSheet, Button, FlatList, Image, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { exerciseListAll } from "@/constants/exerciseNew";



export default function Tab() {
  const [exercises, setExercises] = useState(exerciseListAll);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={{ padding: 16, flex: 1 }}>

        {/* Exercise List */}
        <FlatList data={filteredExercises} renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => {
              router.push({ pathname: '/exerciseDetails', params: { item: JSON.stringify(item) } })
            }}>
            <View style={styles.containerBox}>

                <View style={styles.exGifContainer}>
                  <Image  source={item.pic ? item.pic : require('@/assets/images/icon.png')} style={styles.exGif}/>
                </View>
              
              <View style={{ marginLeft: 10 }}>
                <ThemedText style={styles.capitalize} type="subtitle">{item.name}</ThemedText>
                <ThemedText style={styles.capitalize}>{item.target} | {item.equipment}</ThemedText>
              </View>
            </View>
            </TouchableOpacity>
          )}
          
          keyExtractor={(item) => item.id}

          ListHeaderComponent={
            <View>
              <ThemedText style={styles.menuTitle} type="title">Exercises</ThemedText>
              <TextInput style={styles.searchBar} placeholderTextColor={'white'} placeholder="Search exercises" value={searchQuery} onChangeText={setSearchQuery}/>
            </View>
          }
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
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 40,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#222",
    fontSize: 18,
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
  menuTitle: {
    textAlign: 'center',
    marginTop: 100,
    padding: 20,
    fontSize: 50,
  },
});
