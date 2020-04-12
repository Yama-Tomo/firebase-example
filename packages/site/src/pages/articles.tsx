import React, { ComponentProps, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import firebase from 'firebase/app';
import 'firebase/firestore';
import styled from 'styled-components';
import Image, { FixedObject } from 'gatsby-image';
import { SearchResultThumbnailsQuery } from '../../graphql';
import { WithLayout } from '~/components/layout';
import { PublicArticle, publicArticleCollection } from '~/external_packages/firestore_schema';
import { ngramCreator } from '~/external_packages/ngram';

type CollRef<T> = firebase.firestore.CollectionReference<T>;
type Query<T> = firebase.firestore.Query<T>;

type Props = {
  onSearchClick: () => void;
  articles: PublicArticle<true>[];
  articleThumbs: Record<string, FixedObject | undefined>;
  className?: string;
};

const UiComponent = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <div className={props.className}>
    <h1>article</h1>
    <input type="text" ref={ref} />
    <button onClick={props.onSearchClick}>検索</button>
    <ul>
      {props.articles.map(article => (
        <li key={article.id}>
          <div>
            <Link to={`/articles/${article.id}`}>{article.title}</Link>
            {props.articleThumbs[article.id] && <Image fixed={props.articleThumbs[article.id]} />}
          </div>
        </li>
      ))}
    </ul>
  </div>
));

const StyledUiComponent = styled(UiComponent)`
  li {
    margin-bottom: 8px;

    > div {
      display: flex;
      align-items: center;

      > a {
        margin-right: 8px;
      }
    }
  }
`;

const Container: React.FCX<PageProps<SearchResultThumbnailsQuery, {}>> = props => {
  const ref = useRef<HTMLInputElement>(null);
  const [searchWord, setSearchWord] = useState('');
  const [articles, setArticles] = useState<Props['articles']>([]);

  const articleThumbs = useMemo(() => {
    return props.data.allFile.nodes.reduce((result, v) => {
      if (!v?.fields?.articleId || !v?.childImageSharp) {
        return result;
      }

      return {
        ...result,
        [v.fields.articleId]: v.childImageSharp.fixed as FixedObject,
      };
    }, {} as Props['articleThumbs']);
  }, [props.data]);

  useEffect(() => {
    if (!searchWord || searchWord.length < 2) {
      setArticles([]);
      return;
    }

    const queryBase = (firebase.firestore().collection(publicArticleCollection) as CollRef<
      PublicArticle
    >) as Query<PublicArticle>;

    const query = ngramCreator(searchWord, 2)
      .filter(search => !search.includes(' ')) // スペースが含まれている境目は取り除いてノイズを減らす
      .reduce((query, search) => {
        return query.where(`free_word.${search}`, '==', true);
      }, queryBase);

    query.get().then(snapShot => {
      const data = snapShot.docs.map(d => ({ id: d.id, ...d.data() }));
      setArticles(data);
    });
  }, [searchWord, setArticles]);

  const innerProps: ComponentProps<typeof UiComponent> = {
    onSearchClick() {
      setSearchWord(ref.current?.value || '');
    },
    ref,
    articles,
    articleThumbs,
  };

  return <StyledUiComponent {...innerProps} />;
};

export const query = () => graphql`
  query SearchResultThumbnails {
    allFile(filter: { fields: { articleId: { ne: "" } } }) {
      nodes {
        fields {
          articleId
        }
        childImageSharp {
          fixed(width: 120, height: 60) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }
      }
    }
  }
`;

export default WithLayout(Container);
