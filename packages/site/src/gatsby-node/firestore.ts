import * as Firebase from 'firebase/app';
import { NodePluginArgs } from 'gatsby';
import {
  Information,
  informationCollection,
  articleCollection,
  Article,
} from '~/external_packages/firestore_schema';

type CollRef<T> = Firebase.firestore.CollectionReference<T>;
type CreateNodeLists = Array<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [string, () => Promise<Firebase.firestore.QuerySnapshot<any>>, (data: any) => {}]
>;

// firestoreのデータをgatsby上のgraphqlで扱えるようにするためのデータを用意する関数
export const sourceNodes = async (
  { actions, createContentDigest }: NodePluginArgs,
  store: Firebase.firestore.Firestore
) => {
  const promises = getNodeLists(store).map(async ([collectionName, getQs, mapData]) => {
    const qs = await getQs();

    qs.docs.forEach(doc => {
      const nodeData = mapData(doc.data());
      const nodeMeta = {
        id: doc.id,
        parent: undefined,
        children: [],
        internal: {
          type: collectionName,
          contentDigest: createContentDigest(nodeData),
        },
      };

      actions.createNode(Object.assign({}, nodeData, nodeMeta));
    });
  });

  // TODO: 同時に処理する数を制限できるように
  await Promise.all(promises);
};

const getNodeLists = (store: Firebase.firestore.Firestore): CreateNodeLists => [
  toTuple(
    informationCollection,
    () => (store.collection(informationCollection) as CollRef<Information>).get(),
    data => {
      const { created_at, ...rest } = data;

      return {
        ...rest,
        // シリアライズ可能な値に変換しないとgraphqlでデータを取得できないので変換
        created_at: { sec: created_at.seconds, nanoSec: created_at.nanoseconds },
      };
    }
  ),
  toTuple(
    articleCollection,
    () => (store.collection(articleCollection) as CollRef<Article>).get(),
    data => {
      const { updated_at, created_at, ...rest } = data;

      return {
        ...rest,
        updated_at: { sec: updated_at.seconds, nanoSec: updated_at.nanoseconds },
        created_at: { sec: created_at.seconds, nanoSec: created_at.nanoseconds },
      };
    }
  ),
];

// `mapData` の実装を型で守るための目的でタプルを返す関数
const toTuple = <T>(
  collectionName: string,
  getQuerySnapshot: () => Promise<Firebase.firestore.QuerySnapshot<T>>,
  mapData: (data: T) => object
) => [collectionName, getQuerySnapshot, mapData] as const;
