import { Article } from './article';

export const publicArticleCollection = 'public_articles';

export type PublicArticle = Article & {
  free_word: { [key: string]: true };
};
