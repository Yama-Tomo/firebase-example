import * as firebase from 'firebase';
import { WithReadProps } from './utils';

export const adminUidsCollection = 'admin_uids';

export type AdminUid<IS_READ = false> = WithReadProps<IS_READ> & {
  uid: string;
  created_at: firebase.firestore.Timestamp;
};
