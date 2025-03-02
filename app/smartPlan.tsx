import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/context/userContext';
import auth from '@react-native-firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function Tab() {

    const { name, weight, weightRecords, height, workoutCount, workoutRecords, gender } = useUser();

    const [selectedLevel, setSelectedLevel] = useState("beginner");
    const [selectedGoal, setSelectedGoal] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("workout");
    const [equipment, setEquipment] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState("");

    const handleEquipmentToggle = (item: string) => {
        if (equipment.includes(item)) {
            setEquipment(equipment.filter(eq => eq !== item));
        } else {
            setEquipment([...equipment, item]);
        }
    };

    const handleGeneratePlan = () => {
        // Logic for generating the workout plan
        console.log("Generating plan for:", {
            level: selectedLevel,
            goal: selectedGoal,
            equipment
        });
        alert("Workout Plan Generated!");
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <LinearGradient colors={["#1E1E1E", "black"]} style={styles.container}>
                <ThemedText style={styles.menuTitle} type="title">Smart Plan</ThemedText>
                <ThemedText style={{ fontWeight: '400', padding: 20, alignSelf: 'center' }} type="subtitle">Create your workout plan</ThemedText>

                {/* Workout / Plan */}
                <ThemedText style={styles.sectionTitle} type="subtitle">Generate</ThemedText>
                <View style={styles.skillLevels}>
                    <Text style={[styles.button, selectedPlan === "workout" && styles.selected]} onPress={() => setSelectedPlan("workout")}> Workout </Text>
                    <Text style={[styles.button, selectedPlan === "plan" && styles.selected]} onPress={() => setSelectedPlan("plan")}> Plan </Text>
                </View>


                {/* Skill Levels */}
                <ThemedText style={styles.sectionTitle} type="subtitle">Skill Level</ThemedText>
                <View style={styles.skillLevels}>
                    <Text style={[styles.button, selectedLevel === "beginner" && styles.selected]} onPress={() => setSelectedLevel("beginner")}> Beginner </Text>
                    <Text style={[styles.button, selectedLevel === "intermediate" && styles.selected]} onPress={() => setSelectedLevel("intermediate")}> Intermediate </Text>
                    <Text style={[styles.button, selectedLevel === "advanced" && styles.selected]} onPress={() => setSelectedLevel("advanced")}> Advanced </Text>
                </View>

                { selectedPlan === "workout" ? (
                    /* Muscle Groups */
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
                ) : null
                }

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

                {/* Gender */}
                <ThemedText style={styles.sectionTitle} type="subtitle">Gender</ThemedText>
                <View style={styles.skillLevels}>
                    <Text style={[styles.button, selectedGender === "male" && styles.selected]} onPress={() => setSelectedGender("male")}>Male</Text>
                    <Text style={[styles.button, selectedGender === "female" && styles.selected]} onPress={() => setSelectedGender("female")}>Female</Text>
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
    container: {
        flex: 1,
    },
    menuTitle: {
        textAlign: 'center',
        marginTop: 100,
        padding: 20,
        fontSize: 50,
    },
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
    selected: {
        backgroundColor: "rebeccapurple",
        fontSize: 20,
    },
    sectionTitle: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 20,
        color: "white",
    },
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
    selectedEquipment: {
        backgroundColor: "rebeccapurple",
    },
    equipmentText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    generateButton: {
        backgroundColor: "rebeccapurple",
        margin: 30,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    generateButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
