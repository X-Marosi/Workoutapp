import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type UserContextType = {
  user: FirebaseAuthTypes.User | null;
  name: string;
  weight: number;
  weightRecords: number[];
  height: string;
  workouts: string;
  gender: string;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);
  const [weightRecords, setWeightRecords] = useState<number[]>([]);
  const [height, setHeight] = useState('');
  const [workouts, setWorkouts] = useState('');
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

    const unsubscribe = firestore().collection('users').doc(user.uid).onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.data();

        setName(data?.username || '');
        setWeight(data?.weight?.[data?.weight.length - 1] || 0);
        setWeightRecords(data?.weight || []);
        setHeight(data?.height || '');
        setWorkouts(data?.workouts || '');
        setGender(data?.gender || '');
        setLoading(false);
      });

    return unsubscribe;
  }, [user]);

  return (
    <UserContext.Provider value={{ user, name, weight, weightRecords, height, workouts, gender, loading }} >
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
