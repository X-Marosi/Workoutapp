import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type UserContextType = {
  user: FirebaseAuthTypes.User | null;
  name: string;
  weight: number;
  weightRecords: number[];
  height: string;
  workoutCount: string;
  workoutRecords: [Date, number][];
  gender: string;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);
  const [weightRecords, setWeightRecords] = useState<number[]>([]);
  const [ workoutRecords, setWorkoutRecords ] = useState<[Date, number][]>([]);
  const [height, setHeight] = useState('');
  const [workoutCount, setWorkoutCount] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribeUser = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.data();

        setName(data?.username || '');
        setWeight(data?.weight?.[data?.weight.length - 1] || 0);
        setWeightRecords(data?.weight || []);
        setHeight(data?.height || '');
        setWorkoutCount(data?.workouts || '');
        setGender(data?.gender || '');

        setLoading(false);
      });

      const unsubscribeWorkouts = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('workouts')
      .onSnapshot((documentSnapshot) => {
        const workoutsList = documentSnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = data.createdAt.toDate(); // Convert Firestore Timestamp to JS Date
          const formattedDate = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
          return {
            volume: 1,
            date: formattedDate,
          };
        });
  
        setWorkoutRecords(workoutsList.map((workout) => [workout.date, workout.volume]));
      });

      console.log(workoutRecords);

    return () => {
      unsubscribeUser();
      unsubscribeWorkouts();
    };
  }, [user]);



  return (
    <UserContext.Provider value={{ user, name, weight, weightRecords, height, workoutCount, workoutRecords, gender, loading }} >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
