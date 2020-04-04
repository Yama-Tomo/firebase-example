import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  Article,
  articleCollection,
  PublicArticle,
  publicArticleCollection,
} from '../../firestore_schema';

const db = admin.initializeApp(functions.config().firebase).firestore();
const artistDocPath = `${articleCollection}/{id}`;

const ngramCreator = (words: string, n: number) => {
  const grams: string[] = [];

  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.substr(i, n).toLowerCase());
  }

  return grams.reduce<PublicArticle['free_word']>((result, val) => {
    result[val] = true;
    return result;
  }, {});
};

export const syncPublicArticleOnCreate = functions.firestore
  .document(artistDocPath)
  .onCreate((snap, context) => {
    const id = context.params.id as string;
    const data = snap.data() as Article;
    const createData: PublicArticle = {
      ...data,
      free_word: ngramCreator(data.title + data.body + data.tags.join(''), 2),
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
      free_word: ngramCreator(data.title + data.body + data.tags.join(''), 2),
    };

    return db.collection(publicArticleCollection).doc(id).update(updateData);
  });

export const syncPublicArticleOnDelete = functions.firestore
  .document(artistDocPath)
  .onDelete((snap, context) => {
    const id = context.params.id as string;
    return db.collection(publicArticleCollection).doc(id).delete();
  });
