import * as firebase from 'firebase';
import { WithReadProps } from './utils';

export const informationCollection = 'information';

export type Information<IS_READ = false> = WithReadProps<IS_READ> & {
  text: string;
  created_at: firebase.firestore.Timestamp;
};
