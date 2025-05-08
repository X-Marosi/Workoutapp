import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
type Exercise = { id: string; name: string; target: string; pic: any };
type SetDetails = { setNumber: number; rpe: number; weight: number; reps: number };
type ExerciseSet = { isComplete: boolean; sets: SetDetails[] };

interface WorkoutContextType {
  exercises: Exercise[];
  exerciseSets: Record<string, ExerciseSet>;
  totalWeight: number;
  totalSets: number;
  elapsedTime: number;
  timerState: string;
  workoutName: string;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  toggleState: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  deleteSet: (exerciseId: string) => void;
  updateSetDetails: (exerciseId: string, setNumber: number, field: 'weight' | 'reps' | 'rpe', value: number) => void;
  setWorkoutName: (name: string) => void;
  setTimerState: (state: string) => void;
  resetWorkout: () => void;
  loadWorkoutPlan: (exercises: Exercise[], sets: Record<string, ExerciseSet>, name: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<Record<string, ExerciseSet>>({});
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerState, setTimerState] = useState('running');

  const nameWorkout = () => {
    let time = new Date().getHours();
    if (time >= 6 && time < 12) return "Morning Workout";
    else if (time > 12 && time <= 18) return "Afternoon Workout";
    else if (time > 18 || time < 6) return "Evening Workout";
    return "Workout";
  };

  const [workoutName, setWorkoutName] = useState(nameWorkout());

  // Update total weight and sets
  useEffect(() => {
    updateVolume();
    updateTotalSets();
  }, [exerciseSets]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState === 'running') {
      const startTime = Date.now() - elapsedTime * 1000;

      interval = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, elapsedTime]);

  const updateVolume = () => {
    let total = 0;
    exercises.forEach((exercise) => {
      const exerciseData = exerciseSets[exercise.id];
      if (exerciseData?.isComplete) {
        exerciseData.sets.forEach((set) => {
          total += set.weight * set.reps;
        });
      }
    });
    setTotalWeight(total);
  };

  const updateTotalSets = () => {
    let total = 0;
    exercises.forEach((exercise) => {
      const exerciseData = exerciseSets[exercise.id];
      if (exerciseData?.isComplete) {
        total += exerciseData.sets.length;
      }
    });
    setTotalSets(total);
  };

  const addExercise = (exercise: Exercise) => {
    // Check if exercise already exists
    if (!exercises.some(ex => ex.id === exercise.id)) {
      setExercises(prevExercises => [...prevExercises, exercise]);
      setExerciseSets(prevState => ({
        ...prevState,
        [exercise.id]: { isComplete: false, sets: [{ setNumber: 1, weight: 0, reps: 0, rpe: 0 }] },
      }));
    }
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== exerciseId));
    setExerciseSets(prevState => {
      const newState = { ...prevState };
      delete newState[exerciseId];
      return newState;
    });
  };

  const toggleState = (exerciseId: string) => {
    setExerciseSets(prevState => ({
      ...prevState,
      [exerciseId]: { ...prevState[exerciseId], isComplete: !prevState[exerciseId].isComplete },
    }));
  };

  const addSet = (exerciseId: string) => {
    setExerciseSets(prevState => {
      const sets = prevState[exerciseId]?.sets || [];
      const newSetNumber = sets.length + 1;
      return {
        ...prevState,
        [exerciseId]: {
          ...prevState[exerciseId],
          sets: [...sets, { setNumber: newSetNumber, weight: 0, reps: 0, rpe: 0 }],
        },
      };
    });
  };

  const deleteSet = (exerciseId: string) => {
    if(exerciseSets[exerciseId]?.sets.length > 1) {
      setExerciseSets(prevState => {
        const sets = prevState[exerciseId]?.sets || [];
        return { ...prevState, [exerciseId]: { ...prevState[exerciseId], sets: sets.slice(0, -1) } };
      });
    } else {
      removeExercise(exerciseId);
    }
  };

  const updateSetDetails = (
    exerciseId: string,
    setNumber: number,
    field: 'weight' | 'reps' | 'rpe',
    value: number
  ) => {
    setExerciseSets(prev => {
      const updatedSets = prev[exerciseId]?.sets.map(set =>
        set.setNumber === setNumber ? { ...set, [field]: value || 0 } : set
      ) || [];
      return { ...prev, [exerciseId]: { ...prev[exerciseId], sets: updatedSets } };
    });
  };

  const resetWorkout = () => {
    setExercises([]);
    setExerciseSets({});
    setTotalWeight(0);
    setTotalSets(0);
    setElapsedTime(0);
    setTimerState('running');
    setWorkoutName(nameWorkout());
  };

  const loadWorkoutPlan = (exercises: Exercise[], sets: Record<string, ExerciseSet>, name: string) => {
    setExercises(exercises);
    setExerciseSets(sets);
    setWorkoutName(name);
    // Reset timer and counting stats
    setElapsedTime(0);
    setTotalWeight(0);
    setTotalSets(0);
  };

  return (
    <WorkoutContext.Provider value={{
      exercises,
      exerciseSets,
      totalWeight,
      totalSets,
      elapsedTime,
      timerState,
      workoutName,
      addExercise,
      removeExercise,
      toggleState,
      addSet,
      deleteSet,
      updateSetDetails,
      setWorkoutName,
      setTimerState,
      resetWorkout,
      loadWorkoutPlan
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

