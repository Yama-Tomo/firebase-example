import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminUid, adminUidsCollection } from './external_packages/firestore_schema';

const adminUidsDocPath = `${adminUidsCollection}/{id}`;

const setAdmin = async (uid: string, isAdmin: boolean) => {
  admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
};

export const assignAdmin = functions.firestore.document(adminUidsDocPath).onCreate((snap) => {
  const data = snap.data() as AdminUid;
  return setAdmin(data.uid, true);
});

export const revokeAdmin = functions.firestore.document(adminUidsDocPath).onDelete((snap) => {
  const data = snap.data() as AdminUid;
  return setAdmin(data.uid, false);
});
