import { Article } from './article';

export const publicArticleCollection = 'public_articles';

export type PublicArticle<IS_READ = false> = Article<IS_READ> & {
  free_word: { [key: string]: true };
};
