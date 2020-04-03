import * as React from 'react';
import * as Firebase from 'firebase/app';
import 'firebase/firestore';
import { Actions, PageProps } from 'gatsby';
import { Information } from '../../../firestore_schema';

type Context = { information: { text: string; createdAt: number }[] };

const Component: React.FC<PageProps<undefined, Context>> = props => {
  return (
    <div>
      <h1>firebase example</h1>
      <h2>information</h2>
      <ul>
        {props.pageContext.information.map((info, idx) => (
          <li key={idx}>
            {new Date(info.createdAt).toLocaleString()}: {info.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const createPageCb = async (
  actions: Actions,
  store: ReturnType<typeof Firebase.firestore>
) => {
  const res = await store.collection('information').get();
  const context: Context = {
    information: res.docs.map(doc => {
      const data = doc.data() as Information;
      // context にはプリミティブな値しか渡せない
      return { text: data.text, createdAt: data.created_at.toDate().getTime() };
    }),
  };

  actions.createPage({
    path: `/`,
    component: require.resolve(__filename.replace('.tsx', '')),
    context,
  });
};

export default Component;
