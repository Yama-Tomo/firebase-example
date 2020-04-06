import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  Article,
  articleCollection,
  PublicArticle,
  publicArticleCollection,
} from '../../firestore_schema';
import { ngramCreator } from '../../ngram';

const db = admin.initializeApp(functions.config().firebase).firestore();
const artistDocPath = `${articleCollection}/{id}`;

const freeWordCreator = (words: string, n: number) =>
  ngramCreator(words, n).reduce<PublicArticle['free_word']>((result, val) => {
    result[val] = true;
    return result;
  }, {});

export const syncPublicArticleOnCreate = functions.firestore
  .document(artistDocPath)
  .onCreate((snap, context) => {
    const id = context.params.id as string;
    const data = snap.data() as Article;
    const createData: PublicArticle = {
      ...data,
      free_word: freeWordCreator(data.title + data.body + data.tags.join(''), 2),
    };

    return db.collection(publicArticleCollection).doc(id).set(createData);
  });

export const syncPublicArticleOnUpdate = functions.firestore
  .document(artistDocPath)
  .onUpdate((snap, context) => {
    const id = context.params.id as string;
    const data = snap.after.data() as Article;
    const updateData: PublicArticle = {
      ...data,
      free_word: freeWordCreator(data.title + data.body + data.tags.join(''), 2),
    };

    return db.collection(publicArticleCollection).doc(id).update(updateData);
  });

export const syncPublicArticleOnDelete = functions.firestore
  .document(artistDocPath)
  .onDelete((snap, context) => {
    const id = context.params.id as string;
    return db.collection(publicArticleCollection).doc(id).delete();
  });
