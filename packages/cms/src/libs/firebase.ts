import firebase from 'firebase/app';
import 'firebase/firestore';
import { Unpacked } from '~/types';

export const initializeFirebase = () => {
  if (firebase.apps.length) {
    return;
  }

  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  });
};

const FieldValue = firebase.firestore.FieldValue;

const defaultAppendProperties = ['updated_at', 'created_at'] as const;

// const result = appendTimestamp({aa: 1, bb: 'aaa'}) => { aa: number, bb: string, updated_at: Timestamp, created_at: Timestamp }
export function appendTimestamp<T>(
  data: T
): T & Record<Unpacked<typeof defaultAppendProperties>, firebase.firestore.Timestamp>;

// const result = appendTimestamp({aa: 1, bb: 'aaa'}, (['hoge'] as const)) => { aa: number, bb: string, hoge: Timestamp }
export function appendTimestamp<T, F extends readonly string[]>(
  data: T,
  fields: F
): T & Record<Unpacked<F>, firebase.firestore.Timestamp>;

export function appendTimestamp<T, F extends readonly string[]>(
  data: T,
  fields?: F
): T & Record<Unpacked<F>, firebase.firestore.Timestamp> {
  const appendData = (fields || (defaultAppendProperties as readonly string[])).reduce(
    (result, current) => {
      const key = current as keyof typeof result;

      return {
        ...result,
        [key]: FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      };
    },
    {} as Record<Unpacked<F>, firebase.firestore.Timestamp>
  );

  return { ...data, ...appendData };
}
