import React from 'react';
import Image, { FluidObject } from 'gatsby-image';
import { CreatePagesArgs, PageProps, graphql } from 'gatsby';
import { ArticleByIdQuery } from '../../../graphql';
import { WithLayout } from '~/components/layout';
import { articleCollection } from '@firebase-example/firestore_schema';
import { hasKey } from '~/libs';

const Component: React.FCX<PageProps<ArticleByIdQuery, {}>> = props => (
  <>
    <div>
      <h1>{props.data!.articles?.title}</h1>
      {props.data!.file?.childImageSharp?.fluid != null && (
        <Image fluid={props.data.file.childImageSharp.fluid as FluidObject} />
      )}
      <p>{props.data!.articles?.body}</p>
      <h4>tags</h4>
      <ul>
        {(props.data!.articles?.tags || []).map((tag, idx) => (
          <li key={idx}>{tag}</li>
        ))}
      </ul>
    </div>
  </>
);

// NOTE: 変数代入にしてしまうと gatsby-node.js がこのファイルを require した時点で graphql が評価されてしまうのでそれを防ぐ為に関数にする
// (関数にしても gatsbyは graphql を検知してくれるっぽい
export const query = () => graphql`
  query ArticleById($articleId: String) {
    articles(id: { eq: $articleId }) {
      title
      body
      id
      tags
      created_at {
        nanoSec
        sec
      }
    }
    file(fields: { articleId: { eq: $articleId } }) {
      childImageSharp {
        fluid(maxWidth: 1280) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export const createPageCb = async (args: CreatePagesArgs) => {
  // NOTE: 1つのファイルでgraphql を複数定義できないので getNodesByType でデータ取得する
  // graphql の型を再利用できないので unknown にして堅牢にする
  const articles: unknown = args.getNodesByType(articleCollection);

  Array.isArray(articles) &&
    articles.forEach((article: unknown) => {
      if (hasKey(article, 'id')) {
        const id = String(article.id);

        args.actions.createPage({
          path: `/articles/${id}`,
          component: require.resolve(__filename.replace('.tsx', '')),
          context: { articleId: id },
        });
      }
    });
};

export default WithLayout(Component);
