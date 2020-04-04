import * as firebase from 'firebase';

export const articleCollection = 'articles';

export type Article = {
  title: string;
  body: string;
  tags: string[];
  update_at: firebase.firestore.Timestamp;
  created_at: firebase.firestore.Timestamp;
}
