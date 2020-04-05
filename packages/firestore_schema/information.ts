import * as firebase from 'firebase';

export type Information = {
  text: string;
  created_at: firebase.firestore.Timestamp;
};
