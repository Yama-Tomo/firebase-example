import * as firebase from 'firebase';

export const adminUidsCollection = 'admin_uids';

export type AdminUid = {
  uid: string;
  created_at: firebase.firestore.Timestamp;
}
