import * as firebase from 'firebase';

export const articleCollection = 'articles';

export type Article = {
  title: string;
  body: string;
  tags: string[];
  updated_at: firebase.firestore.Timestamp;
  created_at: firebase.firestore.Timestamp;
}
