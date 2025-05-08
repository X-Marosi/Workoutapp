import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/context/userContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { exerciseListAll } from "@/constants/exerciseNew";
import { router } from 'expo-router';

// Function to shuffle an array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function Tab() {
  const { name, weight, weightRecords, height, workoutCount, workoutRecords, gender } = useUser();

  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("workout");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedSplit, setSelectedSplit] = useState("");

  // Toggle selection (used for both muscle groups and equipment types)
  const handleEquipmentToggle = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(eq => eq !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleGeneratePlan = async () => {
    // Separate selections into muscle groups and equipment availability.
    const muscleGroups = equipment.filter(item =>
      ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Glutes", "Hamstrings", "Calves"].includes(item)
    );
    const equipmentSelection = equipment.filter(item =>
      ["Bodyweight", "Dumbbells", "Barbell", "Machines"].includes(item)
    );

    // Map our equipment options to acceptable values for filtering.
    const equipmentMapping = {
      "Bodyweight": ["body weight", "weighted"],
      "Dumbbells": ["dumbbell"],
      "Barbell": ["barbell"],
      "Machines": ["machine", "cable"]
    };

    // Get a list of allowed equipment types.
    let allowedEquipment = null;
    if (equipmentSelection.length > 0 && equipmentSelection.length < 4) {
      allowedEquipment = equipmentSelection.reduce((acc, curr) => acc.concat(equipmentMapping[curr] || []), []);
    }

    // Determine rep count based on selected goal
    let repCount = 12; // default hypertrophy
    if (selectedGoal === "strength") {
      repCount = 6;
    } else if (selectedGoal === "endurance") {
      repCount = 20;
    }

    // Select exercises for a given muscle group from the exercise list.
    const selectExercisesForMuscle = (muscle, count) => {
      let filteredExercises = exerciseListAll.filter(exercise => {
        const matchesMuscle = exercise.bodyPart.toLowerCase() === muscle.toLowerCase();
        const matchesEquipment = allowedEquipment ? allowedEquipment.includes(exercise.equipment.toLowerCase()) : true;
        return matchesMuscle && matchesEquipment;
      });
      // Shuffle the selection
      filteredExercises = shuffleArray(filteredExercises);
      // Cut off the excess
      return filteredExercises.slice(0, count);
    };

    // For non-fullBody splits, get exercise count per muscle.
    const getCount = (muscle) => {
      if (["Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves"].includes(muscle)) {
        return 2;
      } else {
        return 3;
      }
    };

    // Attach three sets to each exercise
    const formatExercises = (exercises) =>
      exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: [
          { weight: 0, setNumber: 1, reps: repCount },
          { weight: 0, setNumber: 2, reps: repCount },
          { weight: 0, setNumber: 3, reps: repCount },
        ],
        pic: exercise.pic || null,
      }));

    // The array of workout objects to upload (for uplading moultiple workouts at once).
    let workoutsToUpload = [];

    if (selectedSplit === "pushPullLegs") {
      // Define split buckets.
      const splitMapping = {
        pull: ["Back", "Biceps"],
        push: ["Chest", "Shoulders", "Triceps"],
        legs: ["Quads", "Glutes", "Hamstrings", "Calves"]
      };
      let splitWorkouts = { pull: [], push: [], legs: [] };
      for (const category in splitMapping) {
        splitMapping[category].forEach(muscle => {
          if (muscleGroups.includes(muscle)) {
            const count = getCount(muscle);
            const exercises = selectExercisesForMuscle(muscle, count);
            splitWorkouts[category] = splitWorkouts[category].concat(exercises);
          }
        });
      }
      // Format and push separate workouts if there are exercises.
      Object.entries(splitWorkouts).forEach(([category, exercises]) => {
        if (exercises.length > 0) {
          workoutsToUpload.push({
            name: `Smart ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            createdAt: new Date(),
            exercises: formatExercises(exercises)
          });
        }
      });
    } else if (selectedSplit === "antagonistic") {
      // Three workouts:
      // Workout 1: Chest + Biceps
      let w1 = [];
      if (muscleGroups.includes("Chest")) {
        w1 = w1.concat(selectExercisesForMuscle("Chest", 3));
      }
      if (muscleGroups.includes("Biceps")) {
        w1 = w1.concat(selectExercisesForMuscle("Biceps", 2));
      }
      // Workout 2: Back + Triceps
      let w2 = [];
      if (muscleGroups.includes("Back")) {
        w2 = w2.concat(selectExercisesForMuscle("Back", 3));
      }
      if (muscleGroups.includes("Triceps")) {
        w2 = w2.concat(selectExercisesForMuscle("Triceps", 2));
      }
      // Workout 3: Shoulders + Legs (Quads, Glutes, Hamstrings, Calves)
      let w3 = [];
      if (muscleGroups.includes("Shoulders")) {
        w3 = w3.concat(selectExercisesForMuscle("Shoulders", 3));
      }
      ["Quads", "Glutes", "Hamstrings", "Calves"].forEach(muscle => {
        if (muscleGroups.includes(muscle)) {
          w3 = w3.concat(selectExercisesForMuscle(muscle, 2));
        }
      });
      if (w1.length > 0)
        workoutsToUpload.push({ name: "Smart Chest+Bi", createdAt: new Date(), exercises: formatExercises(w1) });
      if (w2.length > 0)
        workoutsToUpload.push({ name: "Smart Back+Tri", createdAt: new Date(), exercises: formatExercises(w2) });
      if (w3.length > 0)
        workoutsToUpload.push({ name: "Smart Shoulders+Legs", createdAt: new Date(), exercises: formatExercises(w3) });
    } else if (selectedSplit === "custom") {
      // Four workouts:
      // Workout 1: Chest only.
      let cw1 = muscleGroups.includes("Chest") ? selectExercisesForMuscle("Chest", 3) : [];
      // Workout 2: Back only.
      let cw2 = muscleGroups.includes("Back") ? selectExercisesForMuscle("Back", 3) : [];
      // Workout 3: Arms (Shoulders + Biceps + Triceps)
      let cw3 = [];
      if (muscleGroups.includes("Shoulders")) {
        cw3 = cw3.concat(selectExercisesForMuscle("Shoulders", 3));
      }
      if (muscleGroups.includes("Biceps")) {
        cw3 = cw3.concat(selectExercisesForMuscle("Biceps", 2));
      }
      if (muscleGroups.includes("Triceps")) {
        cw3 = cw3.concat(selectExercisesForMuscle("Triceps", 2));
      }
      // Workout 4: Legs (Quads, Glutes, Hamstrings, Calves)
      let cw4 = [];
      ["Quads", "Glutes", "Hamstrings", "Calves"].forEach(muscle => {
        if (muscleGroups.includes(muscle)) {
          cw4 = cw4.concat(selectExercisesForMuscle(muscle, 2));
        }
      });
      if (cw1.length > 0)
        workoutsToUpload.push({ name: "Smart Chest", createdAt: new Date(), exercises: formatExercises(cw1) });
      if (cw2.length > 0)
        workoutsToUpload.push({ name: "Smart Back", createdAt: new Date(), exercises: formatExercises(cw2) });
      if (cw3.length > 0)
        workoutsToUpload.push({ name: "Smart Arms", createdAt: new Date(), exercises: formatExercises(cw3) });
      if (cw4.length > 0)
        workoutsToUpload.push({ name: "Smart Legs", createdAt: new Date(), exercises: formatExercises(cw4) });
    } else if (selectedSplit === "fullBody") {
      // Three full body variations.
      for (let day = 1; day <= 3; day++) {
        let fbWorkout = [];
        // For non-leg groups: Chest, Back, Shoulders, Biceps, Triceps, Calves (if selected, pick 1 each)
        const nonLegGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Calves"];
        nonLegGroups.forEach(muscle => {
          if (muscleGroups.includes(muscle)) {
            fbWorkout = fbWorkout.concat(selectExercisesForMuscle(muscle, 1));
          }
        });
        // For leg muscles: union of Quads, Glutes, Hamstrings (if any selected), pick 2 total.
        const legPoolMuscles = ["Quads", "Glutes", "Hamstrings"];
        let legPool = [];
        legPoolMuscles.forEach(muscle => {
          if (muscleGroups.includes(muscle)) {
            const exercises = exerciseListAll.filter(exercise => {
              const matchesMuscle = exercise.bodyPart.toLowerCase() === muscle.toLowerCase();
              const matchesEquipment = allowedEquipment ? allowedEquipment.includes(exercise.equipment.toLowerCase()) : true;
              return matchesMuscle && matchesEquipment;
            });
            legPool = legPool.concat(exercises);
          }
        });
        legPool = shuffleArray(legPool);
        const selectedLegs = legPool.slice(0, 2);
        fbWorkout = fbWorkout.concat(selectedLegs);
        if (fbWorkout.length > 0) {
          workoutsToUpload.push({
            name: `Smart Full Body Day ${day}`,
            createdAt: new Date(),
            exercises: formatExercises(fbWorkout)
          });
        }
      }
    } else {
      // Fallback: Single workout generation for all selected muscle groups.
      let fallbackWorkout = [];
      muscleGroups.forEach(muscle => {
        fallbackWorkout = fallbackWorkout.concat(selectExercisesForMuscle(muscle, getCount(muscle)));
      });
      if (fallbackWorkout.length > 0) {
        workoutsToUpload.push({
          name: "Smart Plan Workout",
          createdAt: new Date(),
          exercises: formatExercises(fallbackWorkout)
        });
      }
    }

    // Now upload each workout as a separate document.
    try {
      const uid = auth().currentUser.uid;
      for (const workoutData of workoutsToUpload) {
        await firestore()
          .collection('users')
          .doc(uid)
          .collection('workoutPlans')
          .add(workoutData);
      }
      router.navigate({ pathname: '/workouts' });
    } catch (error) {
      console.error("Error saving workout plan:", error);
      alert("Error saving workout plan!");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
        <ThemedText style={styles.menuTitle} type="title">Smart Plan</ThemedText>
        <ThemedText style={{ fontWeight: '400', paddingBottom: 20, alignSelf: 'center' }} type="subtitle">
          Create your workout plan
        </ThemedText>

        {/* Workout / Plan */}
        <ThemedText style={styles.sectionTitle} type="subtitle">Generate</ThemedText>
        <View style={styles.skillLevels}>
          <Text style={[styles.button, selectedPlan === "workout" && styles.selected]} onPress={() => setSelectedPlan("workout")}> Workout </Text>
          <Text style={[styles.button, selectedPlan === "plan" && styles.selected]} onPress={() => setSelectedPlan("plan")}> Plan </Text>
        </View>


        {
          selectedPlan === "plan" && (
            <View>
              {/* Split Type */}
              <ThemedText style={styles.sectionTitle} type="subtitle">Split Type</ThemedText>
              <View style={styles.equipmentOptions}>
                {/*<Text style={[styles.splitButton, selectedSplit === "full" && styles.selectedEquipment]} onPress={() => setSelectedSplit("full")}> Full Body (Fallback) </Text>*/}
                {/*<Text style={[styles.splitButton, selectedSplit === "upperLower" && styles.selectedEquipment]} onPress={() => setSelectedSplit("upperLower")}> Upper/Lower </Text>*/}
                <Text style={[styles.splitButton, selectedSplit === "pushPullLegs" && styles.selectedEquipment]} onPress={() => setSelectedSplit("pushPullLegs")}> PPL </Text>
                <Text style={[styles.splitButton, selectedSplit === "antagonistic" && styles.selectedEquipment]} onPress={() => setSelectedSplit("antagonistic")}> Antagonistic </Text>
                <Text style={[styles.splitButton, selectedSplit === "custom" && styles.selectedEquipment]} onPress={() => setSelectedSplit("custom")}> Custom </Text>
                <Text style={[styles.splitButton, selectedSplit === "fullBody" && styles.selectedEquipment]} onPress={() => setSelectedSplit("fullBody")}> Full Body </Text>
              </View>
            </View>
          )
        }


        {/* Skill Levels */}
        <ThemedText style={styles.sectionTitle} type="subtitle">Skill Level</ThemedText>
        <View style={styles.skillLevels}>
          <Text style={[styles.button, selectedLevel === "beginner" && styles.selected]} onPress={() => setSelectedLevel("beginner")}> Beginner </Text>
          <Text style={[styles.button, selectedLevel === "intermediate" && styles.selected]} onPress={() => setSelectedLevel("intermediate")}> Intermediate </Text>
          <Text style={[styles.button, selectedLevel === "advanced" && styles.selected]} onPress={() => setSelectedLevel("advanced")}> Advanced </Text>
        </View>

        {/* Muscle Groups */}
        <View>
          <ThemedText style={styles.sectionTitle} type="subtitle">Muscle Groups</ThemedText>
          <View style={styles.equipmentOptions}>
            {["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Glutes", "Hamstrings", "Calves"].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEquipmentToggle(item)}
                style={[styles.equipmentButton, equipment.includes(item) && styles.selectedEquipment]}
              >
                <Text style={styles.equipmentText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Goals */}
        <ThemedText style={styles.sectionTitle} type="subtitle">Workout Goal</ThemedText>
        <View style={styles.goalOptions}>
          <Text style={[styles.button, selectedGoal === "strength" && styles.selected]} onPress={() => setSelectedGoal("strength")}> Strength </Text>
          <Text style={[styles.button, selectedGoal === "hypertrophy" && styles.selected]} onPress={() => setSelectedGoal("hypertrophy")}> Muscle Gain </Text>
          <Text style={[styles.button, selectedGoal === "endurance" && styles.selected]} onPress={() => setSelectedGoal("endurance")}> Endurance </Text>
        </View>

        {/* Equipment Availability */}
        <ThemedText style={styles.sectionTitle} type="subtitle">Equipment</ThemedText>
        <View style={styles.equipmentOptions}>
          {["Bodyweight", "Dumbbells", "Barbell", "Machines"].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEquipmentToggle(item)}
              style={[styles.equipmentButton, equipment.includes(item) && styles.selectedEquipment]}
            >
              <Text style={styles.equipmentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Plan Button */}
        <TouchableOpacity onPress={handleGeneratePlan} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Plan</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menuTitle: { textAlign: 'center', marginTop: 100, padding: 20, fontSize: 50 },
  button: {
    color: "white",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 6,
    margin: 0,
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold",
  },
  skillLevels: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 25,
    padding: 5,
    borderRadius: 8,
  },
  selected: { backgroundColor: "rebeccapurple", fontSize: 20 },
  sectionTitle: { marginTop: 20, textAlign: "center", fontSize: 20, color: "white" },
  goalOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 25,
    padding: 5,
    marginTop: 10,
  },
  equipmentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  equipmentButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    margin: 5,
    padding: 10,
  },
  splitButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    margin: 5,
    padding: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedEquipment: { backgroundColor: "rebeccapurple" },
  equipmentText: { color: "white", fontSize: 16, fontWeight: "bold" },
  generateButton: {
    backgroundColor: "rebeccapurple",
    margin: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  generateButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});



