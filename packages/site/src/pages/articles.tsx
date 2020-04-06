import React, { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react';
import { PageProps } from 'gatsby';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { WithLayout } from '~/components/layout';
import { PublicArticle, publicArticleCollection } from '~/external_packages/firestore_schema';
import { ngramCreator } from '~/external_packages/ngram';

type CollRef<T> = firebase.firestore.CollectionReference<T>;
type Query<T> = firebase.firestore.Query<T>;

type Props = {
  onSearchClick: () => void;
  articles: PublicArticle<true>[];
};

const UiComponent = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <div>
    <h1>article</h1>
    <input type="text" ref={ref} />
    <button onClick={props.onSearchClick}>検索</button>
    <ul>
      {props.articles.map(article => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  </div>
));

const Container: React.FCX<PageProps<undefined, {}>> = props => {
  const ref = useRef<HTMLInputElement>(null);
  const [searchWord, setSearchWord] = useState('');
  const [articles, setArticles] = useState<Props['articles']>([]);

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
  };

  return <UiComponent {...innerProps} />;
};

export default WithLayout(Container);
