import * as React from 'react';
import 'firebase/firestore';
import { CreatePagesArgs, PageProps } from 'gatsby';
import { AllArticlesQuery } from '../../../graphql';
import { WithLayout } from '~/components/layout';
import { graphql } from '~/libs';

type Context = { article: { title: string; body: string; tags: string[] } };

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

// NOTE: createPages 内でクエリを投げたい場合は ~/libs の graphql を使わないと型定義が生成されないので注意
const query = graphql`
  query AllArticles {
    allArticles {
      edges {
        node {
          body
          id
          tags
          title
          created_at {
            nanoSec
            sec
          }
          updated_at {
            nanoSec
            sec
          }
        }
      }
    }
  }
`;

export const createPageCb = async (args: CreatePagesArgs) => {
  const res = await args.graphql<AllArticlesQuery>(query[0]);

  res!.data!.allArticles.edges.forEach(data => {
    if (
      !(typeof data.node.title == 'string') ||
      !(typeof data.node.body === 'string') ||
      !Array.isArray(data.node.tags)
    ) {
      return;
    }

    const context: Context = {
      article: {
        title: data.node.title,
        body: data.node.body,
        tags: data.node.tags as string[],
      },
    };

    args.actions.createPage({
      path: `/articles/${data.node.id}`,
      component: require.resolve(__filename.replace('.tsx', '')),
      context,
    });
  });
};

export default WithLayout(Component);
