import * as firebase from 'firebase';
import { WithReadProps } from './utils';

export const articleCollection = 'articles';

export type Article<IS_READ = false> = WithReadProps<IS_READ> & {
  title: string;
  body: string;
  tags: string[];
  updated_at: firebase.firestore.Timestamp;
  created_at: firebase.firestore.Timestamp;
};
