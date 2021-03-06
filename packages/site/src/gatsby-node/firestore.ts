import * as Firebase from 'firebase-admin';
import { NodeInput, NodePluginArgs } from 'gatsby';
import moment from 'moment';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import {
  Information,
  informationCollection,
  articleCollection,
  Article,
} from '@firebase-example/firestore_schema';

type CollRef<T> = Firebase.firestore.CollectionReference<T>;
type CreateNodeLists = Array<
  readonly [
    string,
    () => Promise<Firebase.firestore.QuerySnapshot<unknown>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => { [key: string]: unknown }
  ]
>;

// firestoreのデータをgatsby上のgraphqlで扱えるようにするためのデータを用意する関数
export const sourceNodes = async (arg: NodePluginArgs) => {
  const nodeLists = getNodeLists(Firebase.firestore());

  // createNode の実行順が型定義ファイルの順序に影響します
  // それが影響して型定義ファイルのgit管理に支障がでる(毎回中身が変わってdiffが出る)ので非同期関数に左右されないように順序を保証できる入れ物を用意
  const orderedNodes: Map<string, NodeInput[] | null> = new Map();
  nodeLists.forEach(([collectionName]) => orderedNodes.set(collectionName, null));

  const promises = nodeLists.map(async ([collectionName, getQs, mapData]) => {
    const qs = await getQs();

    const nodeInputs = qs.docs.map(doc => {
      const _data = mapData(doc.data());

      // データのプロパティの順番も型定義ファイルに影響するので一貫性を持たせる為にソート済みのobjectにする
      const orderedData: typeof _data = {};
      Object.keys(_data)
        .sort()
        .forEach(k => (orderedData[k] = _data[k]));

      const nodeMeta = {
        id: doc.id,
        parent: undefined,
        children: [],
        internal: {
          type: collectionName,
          contentDigest: arg.createContentDigest(orderedData),
        },
      };

      return Object.assign({}, orderedData, nodeMeta);
    });

    orderedNodes.set(collectionName, nodeInputs);
  });

  // TODO: 同時に処理する数を制限できるように
  await Promise.all(promises);

  orderedNodes.forEach(nodeInputs => {
    nodeInputs != null && nodeInputs.forEach(nodeInput => arg.actions.createNode(nodeInput));
  });

  await createArticleImageNode(arg, orderedNodes.get(articleCollection)!);
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
  mapData: (data: T) => { [key: string]: unknown }
) => [collectionName, getQuerySnapshot, mapData] as const;

const createArticleImageNode = async (arg: NodePluginArgs, articles: NodeInput[]) => {
  const bucket = Firebase.storage().bucket(process.env.GATSBY_FIREBASE_STORAGE_BUCKET);

  const promises = articles.map(async doc => {
    if (!doc.image_path) {
      return;
    }

    // prettier-ignore
    const expires = moment().utc().add(1, 'minutes').format();
    const [url] = await bucket
      .file(String(doc.image_path))
      .getSignedUrl({ action: 'read', expires });

    if (!url) {
      return;
    }

    const fileNode = await createRemoteFileNode({
      url,
      cache: arg.cache,
      store: arg.store,
      createNode: arg.actions.createNode,
      createNodeId: arg.createNodeId,
      reporter: {},
    });

    await arg.actions.createNodeField({
      node: fileNode,
      name: 'articleId',
      value: doc.id,
    });
  });

  await Promise.all(promises);
};
