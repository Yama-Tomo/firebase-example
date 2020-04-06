import * as React from 'react';
import * as Firebase from 'firebase/app';
import 'firebase/firestore';
import { Actions, PageProps } from 'gatsby';
import { Article, articleCollection } from '~/external_packages/firestore_schema';
import { WithLayout } from '~/components/layout';

type Context = { article: Article<true> };

const Component: React.FCX<PageProps<undefined, Context>> = props => (
  <>
    <div>
      <h1>{props.pageContext.article.title}</h1>
      <p>{props.pageContext.article.body}</p>
      <h4>tags</h4>
      <ul>
        {props.pageContext.article.tags.map((tag, idx) => (
          <li key={idx}>{tag}</li>
        ))}
      </ul>
    </div>
  </>
);

export const createPageCb = async (
  actions: Actions,
  store: ReturnType<typeof Firebase.firestore>
) => {
  const qs = await (store.collection(articleCollection) as Firebase.firestore.CollectionReference<
    Article
  >).get();

  qs.docs.forEach(doc => {
    const data = doc.data();
    const context: Context = {
      article: { ...data, id: doc.id },
    };

    actions.createPage({
      path: `/articles/${doc.id}`,
      component: require.resolve(__filename.replace('.tsx', '')),
      context,
    });
  });
};

export default WithLayout(Component);
